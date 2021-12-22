# `Rarity-Ranking-NFT`

This Project is a fork of Ethereum Boilerplate and demonstrates how you can build your own NFT Rarity Ranker.

![Preview](theapp.gif)

# ⭐️ `Star us`
If this boilerplate helps you build Ethereum dapps faster - please star this project, every star makes us very happy!

# 🚀 Quick Start

📄 Clone or fork `Rarity-Ranking-NFT`:
```sh
git clone https://github.com/IAmJaysWay/Rarity-Ranking-NFT.git
```

🔎 Navigate to the `generator` folder and initialize the rarity generator and install moralis
```sh
cd Rarity-Ranking-NFT
cd generator
npm init
npm install moralis
```

🖼️ Provide your `appId` and `serverUrl` and desired `collectionAddress` and `collectionName` in the `main.js` file
```sh
const serverUrl = ""; //Moralis Server Url here
const appId = ""; //Moralis Server App ID here

const collectionAddress = ""; //Collection Address Here
const collectionName = ""; //CollectioonName Here
```

🏃 Run the Rarity Generator
```sh
node main.js
```

💿 Return to the Origin Repo and Install all dependencies:
```sh
cd -
yarn install 
```

✏ Rename `.env.example` to `.env` in the main folder and provide your `appId` and `serverUrl` from Moralis ([How to start Moralis Server](https://docs.moralis.io/moralis-server/getting-started/create-a-moralis-server)) 
Example:
```jsx
REACT_APP_MORALIS_APPLICATION_ID = xxxxxxxxxxxx
REACT_APP_MORALIS_SERVER_URL = https://xxxxxx.grandmoralis.com:2053/server
```

🎁 In `/src/components/QuickStart.js` Add the NFT collection as an Option(s) to the Select Input (with value corresponding to the collectionName used when running the rarity generator)
```sh
<Option value="YOUr COLLECTION NAME"> Collcetion Name </Option> 
```

🚴‍♂️ Run your App:
```sh
yarn start
```
