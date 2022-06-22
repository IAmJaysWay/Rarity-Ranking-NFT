const Moralis = require("moralis/node");
const { timer } = require("rxjs");

const serverUrl = ""; //Moralis Server Url here
const appId = ""; //Moralis Server App ID here
Moralis.start({ serverUrl, appId });

const resolveLink = (url) => {
  if (!url || !url.includes("ipfs://")) return url;
  return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
};

const collectionAddress = ""; //Collection Address Here
const collectionName = ""; //CollectioonName Here

async function generateRarity(allNFTs) {
  console.log('Starting generateRarity');

  const metadata = Object.keys(allNFTs).map((key, index) => {

    const data = JSON.parse(allNFTs[key].metadata)
    data.token_id = key
    return data

  })

  let totalNum = metadata.length;
  let tally = { TraitCount: {} };

  for (var j in metadata) {

    let nftTraits = metadata[j].attributes.map((e) => e.trait_type);
    let nftValues = metadata[j].attributes.map((e) => e.value);
    let numOfTraits = nftTraits.length;

    if (tally.TraitCount[numOfTraits]) {
      tally.TraitCount[numOfTraits]++;
    } else {
      tally.TraitCount[numOfTraits] = 1;
    }

    for (let i = 0; i < nftTraits.length; i++) {
      let current = nftTraits[i];
      if (tally[current]) {
        tally[current].occurences++;
      } else {
        tally[current] = { occurences: 1 };
      }

      let currentValue = nftValues[i];
      if (tally[current][currentValue]) {
        tally[current][currentValue]++;
      } else {
        tally[current][currentValue] = 1;
      }
    }
  }

  const collectionAttributes = Object.keys(tally);
  let nftArr = [];
  for (let j = 0; j < metadata.length; j++) {
    let current = metadata[j].attributes;
    let totalRarity = 0;
    for (let i = 0; i < current.length; i++) {
      let rarityScore =
        1 / (tally[current[i].trait_type][current[i].value] / totalNum);
      current[i].rarityScore = rarityScore;
      totalRarity += rarityScore;
    }

    let rarityScoreNumTraits =
      8 * (1 / (tally.TraitCount[Object.keys(current).length] / totalNum));
    current.push({
      trait_type: "TraitCount",
      value: Object.keys(current).length,
      rarityScore: rarityScoreNumTraits,
    });
    totalRarity += rarityScoreNumTraits;

    if (current.length < collectionAttributes.length) {
      let nftAttributes = current.map((e) => e.trait_type);
      let absent = collectionAttributes.filter(
        (e) => !nftAttributes.includes(e)
      );

      absent.forEach((type) => {
        let rarityScoreNull =
          1 / ((totalNum - tally[type].occurences) / totalNum);
        current.push({
          trait_type: type,
          value: null,
          rarityScore: rarityScoreNull,
        });
        totalRarity += rarityScoreNull;
      });
    }

    nftArr.push({
      Attributes: current,
      Rarity: totalRarity,
      token_id: metadata[j].token_id,
      image: resolveLink(metadata[j].image),
    });
  }

  nftArr.sort((a, b) => b.Rarity - a.Rarity);

  for (let i = 0; i < nftArr.length; i++) {
    nftArr[i].Rank = i + 1;
    const newClass = Moralis.Object.extend(collectionName);
    const newObject = new newClass();

    newObject.set("attributes", nftArr[i].Attributes);
    newObject.set("rarity", nftArr[i].Rarity);
    newObject.set("tokenId", nftArr[i].token_id);
    newObject.set("rank", nftArr[i].Rank);
    newObject.set("image", nftArr[i].image);

    await newObject.save();
    console.log(i);
  }
}

async function fetchRarity() {

  let cursor = null
  let allNFTs = {}

  do {

    const response = await Moralis.Web3API.token.getAllTokenIds({
      address: collectionAddress,
      chain: "eth",
      cursor: cursor
    });

    console.log(
      `Got page ${response.page} of ${Math.ceil(
        response.total / response.page_size
      )}, ${response.total} total`
    );

    for (const item of response.result) {

      if (item !== null && item.metadata !== null && item.metadata !== null) {

        allNFTs[item.token_id] = {
          metadata: item.metadata,
          token_id: item.token_id,
        };
      }
    }

    console.log('Fetched NFTs: ', Object.keys(allNFTs).length)

    cursor = response.cursor;

  } while (cursor != "" && cursor != null);

  generateRarity(allNFTs)
    .then((result) => {
      console.log('Finish generateRarity')

    })
    .catch((error) => { console.log(error) })

}

fetchRarity()
  .then((result) => {
    console.log('Finish fetchRarity')
  })
  .catch((error) => { console.log(error) })
