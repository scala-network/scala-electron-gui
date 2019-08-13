# Scala Electron GUI Wallet

### Introduction
Scala is a private cryptocurrency based on Monero. Scala aims to provide everyone the ability to mine and transact with ease and security.
More information on the project can be found on the [website](https://scalaproject.io).

### About this project

This is the new electron GUI for Scala. It is open source and completely free to use without restrictions, anyone may create an alternative implementation of the Scala Electron GUI that uses the protocol and network in a compatible manner.
Please submit any changes as pull requests to the development branch, all changes are assessed in the development branch before being merged to master, release tags are considered stable builds for the GUI.

#### Pre-requisites
- Download latest [Scalad](https://github.com/scala-network/scala/releases/latest)

#### Commands
```
nvm use 11.9.0
npm install -g quasar-cli
git clone https://github.com/scala-network/scala-electron-wallet
cd scala-electron-wallet
cp path_to_scala_binaries/scalad bin/
cp path_to_scala_binaries/scala-wallet-rpc bin/
npm install
```

For dev:
```
npm run dev
```

For building:

**Note:** This will only build the binaries for the system you run the command on. Running this command on `linux` will only make `linux` binaries, no `mac` or `windows` binaries.
```
npm run build
```
