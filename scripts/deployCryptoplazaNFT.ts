import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const NFT_NAME = "CryptoplazaCommunity NFT"
const NFT_SYMBOL = "CPCN"
const BASE_URI = "https://coral-estimated-smelt-608.mypinata.cloud/ipfs/QmZL9tXB9A3yGJhwwa8x2sPtyEg6j4SmXxZEBDRRxUWMCh/"


async function main() {

  const [ owner ] = await ethers.getSigners()

  const hre: HardhatRuntimeEnvironment = await import('hardhat')

  const cryptoplazaCommunityFactory = await ethers.getContractFactory("CryptoplazaCommunity")
  const cryptoplazaCommunity = await cryptoplazaCommunityFactory.deploy(NFT_NAME, NFT_SYMBOL, BASE_URI)
  await cryptoplazaCommunity.deployed()

  console.log(
    `CryptoplazaCommunity deployed to ${cryptoplazaCommunity.address}`
  );

  //Verify
  await hre.run("verify:verify", {
    address: cryptoplazaCommunity.address,
    constructorArguments: [
      NFT_NAME,
      NFT_SYMBOL,
      BASE_URI
    ]
  })


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
