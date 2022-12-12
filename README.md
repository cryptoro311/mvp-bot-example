# MVP "Bot" Example

First off, I don't like to use the term "bot" :) The goal of this is to show you how to use Javascript to interact with the contract directly so you don't have the delay associated with using the Metamask interface! "Bot" feels like it's cheating, what we're doing is publicly available and open, we're just doing it faster than our tiny fingers can press buttons in the UI.

## Getting Started

### Installation

We're going to use node.js to run our scripts, so let's install a few things first!

- [Node.js](https://nodejs.org) – A Javascript runtime we'll use to run our scripts
- [Redis](https://redis.io/docs/getting-started) – A key/value store that we'll use to help automate some things
- [VS Code](https://code.visualstudio.com/) – A coding IDE so we can easily view & edit the code (feel free to use any IDE that you want, that one is just free and popular – I use [webstorm](https://www.jetbrains.com/webstorm/).

Follow the instructions at the above links to make sure you're all setup to code & get going!

### Setup Alchemy

We can use a bunch of different tools to interact with the Ethereum blockchain, but for this we're going to use the Alchemy blockchain development platform API as it has a really solid (and fast) free plan :)

1. Create a new file named `.env` at the root directory of the `mvp-bot-example` folder
2. Copy the contents of `.env.template` into your new file
3. Create an account at [Alchemy.com](https://www.alchemy.com/)
4. Once created, create a new (free) "app"
5. Click "View Key" and copy the API Key into the `ALCHEMY_API_KEY=xxx` section of the new `.env` file so it looks like `ALCHEMY_API_KEY=your-key-here`

### Setup Your "Botting" Wallets

1. Create new wallets that you're going to use for this. Feel free to create as many as you'd like, but make sure to NOT re-use wallets you already have. Since you're going to be using the private keys often, it's safest to have burner wallets that you mint in, then immediately pass the NFT to another wallet.
2. Copy the wallet address and [private key](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key) into the `.env` file and replace `WALLET_1_ADDRESS=xxx` and `WALLET_1_PKEY=xxx` with your new details (obviously, use `WALLET_{n}_ADDRESS` for each new wallet you want to use).  
3. **NOTE:** DO NOT put those keys into the `.env.template` file. The `.env` file is special in that it's included in our `.gitignore` file and won't be committed if you decide to commit any changes to the git repo. If you don't know git, that's ok, read more [here](https://docs.github.com/en/get-started/using-git/about-git). If anyone gets these private keys, they get your wallets' content... so please be very careful not to let that file get out there. I also suggest you keep very little in those wallets until you absolutely need to. Stay safe ❤️

## What's in This Repository

### The `/learning` Directory

These are just some things I'm going to go over. Since the goal of this little demo is for you to understand how this stuff works a bit, I want to make sure you understand the basics of Javascript so it doesn't feel like you're looking at gibberish.

### The `/tasks` Directory

This is where we're going to store any files that we want to run from the command line. If we have a file called `mint.js` we'd run that using `node tasks/mint`. We'll consider this our "UI" – it is how we'll interact with our scripts.

### The `/scripts` Directory

This is where we'll keep the actual scripts that we'll be using.

### The `/workers` Directory

This is for the people who really wanna be fast :) I'll explain later.

## Helpful Links

- [web3.js](https://web3js.readthedocs.io/en/v1.8.1/)
- [Potatoz Etherscan](https://etherscan.io/address/0x39ee2c7b3cb80254225884ca001f57118c8f21b6)
- [Cockpunch Etherscan](https://etherscan.io/address/0xc178994cb9b66307cd62db8b411759dd36d9c2ee)