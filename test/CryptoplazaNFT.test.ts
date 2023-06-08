import { time, loadFixture, mine} from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";


const NFT_NAME = "cryptoplazaNFT NFT"
const NFT_SYMBOL = "CPCN"
const BASE_URI = "ipfs://cryptoplaza.uri/"

const YEAR_SEG = 31536000

describe("cryptoplazaNFT", function () {
  
  async function initialSetUp() {
  
    const [owner, otherAccount, otherAccount1, account2, account3, account4, account5, account6] = await ethers.getSigners()

    const cryptoplazaNFTFactory = await ethers.getContractFactory("CryptoplazaNFT")
    const cryptoplazaNFT = await cryptoplazaNFTFactory.deploy(NFT_NAME, NFT_SYMBOL, BASE_URI)

    return { cryptoplazaNFT, owner, otherAccount, otherAccount1, account2, account3, account4, account5, account6 }
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { cryptoplazaNFT, owner} = await loadFixture(initialSetUp)

      expect(await cryptoplazaNFT.owner()).to.equal(owner.address)
    });

    it("Should minted only cryptoplaza", async function () {
      const { cryptoplazaNFT, owner,otherAccount } = await loadFixture(initialSetUp)

      const now = (await ethers.provider.getBlock("latest")).timestamp

      await expect(cryptoplazaNFT.connect(otherAccount).safeMint(otherAccount.address,now)).to.be.revertedWith('Ownable: caller is not the owner')
      await expect(cryptoplazaNFT.connect(owner).safeMint(otherAccount.address,now)).not.to.be.reverted
    });

    it("Should be the rigth tokenUri", async function () {
      const { cryptoplazaNFT, owner,otherAccount } = await loadFixture(initialSetUp)

      const now = (await ethers.provider.getBlock("latest")).timestamp

      await cryptoplazaNFT.connect(owner).safeMint(otherAccount.address,now)

      expect(await cryptoplazaNFT.balanceOf(otherAccount.address)).to.equal(1)
      expect(await cryptoplazaNFT.tokenURI(1)).to.equal(BASE_URI.concat("1").concat("/1"))

      await mine(4, {interval: YEAR_SEG});
      expect(await cryptoplazaNFT.tokenURI(1)).to.equal(BASE_URI.concat("2").concat("/1"))
   
      await mine(3, {interval: YEAR_SEG});
      expect(await cryptoplazaNFT.tokenURI(1)).to.equal(BASE_URI.concat("3").concat("/1"))


    });
    it("Should burn cryptoplaza, owner or approved", async function () {
      const { cryptoplazaNFT, owner, otherAccount, otherAccount1 } = await loadFixture(initialSetUp)

      const now = (await ethers.provider.getBlock("latest")).timestamp
      await cryptoplazaNFT.connect(owner).safeMint(otherAccount.address, now)

      await expect(cryptoplazaNFT.connect(otherAccount1).burn(1)).to.be.revertedWith('ERC721: caller is not token owner or approved')
      await expect(cryptoplazaNFT.connect(otherAccount).burn(1)).not.to.be.reverted

      await cryptoplazaNFT.connect(owner).safeMint(otherAccount.address, now)
      await expect(cryptoplazaNFT.burn(2)).not.to.be.reverted

    });

    it("Should be displayed the member number according to the token position in the tokenIdSortedByTenure list", async function () {
      const { cryptoplazaNFT, owner, otherAccount, otherAccount1, account2, account3, account4, account5, account6 } = await loadFixture(initialSetUp)

      const tenureNow = (await ethers.provider.getBlock("latest")).timestamp
      const tenure1 = tenureNow - 1
      const tenure2 = tenureNow - 2
      const tenure3 = tenureNow - 3
      const tenure4 = tenureNow - 4
      const tenure5 = tenureNow - 5
      const tenure6 = tenureNow - 6
      const tenure7 = tenureNow - 7

      await (await cryptoplazaNFT.connect(owner).safeMint(owner.address,tenureNow)).wait(1)        //1
      await (await cryptoplazaNFT.connect(owner).safeMint(otherAccount.address, tenure1)).wait(1)  //2
      await (await cryptoplazaNFT.connect(owner).safeMint(otherAccount1.address, tenure2)).wait(1) //3
      await (await cryptoplazaNFT.connect(owner).safeMint(account2.address, tenure3)).wait(1)      //4
      await (await cryptoplazaNFT.connect(owner).safeMint(account4.address, tenure4)).wait(1)      //5
      await (await cryptoplazaNFT.connect(owner).safeMint(account3.address, tenure5)).wait(1)      //6
      await (await cryptoplazaNFT.connect(owner).safeMint(account5.address, tenure6)).wait(1)      //7
      await (await cryptoplazaNFT.connect(owner).safeMint(account6.address, tenure7)).wait(1)      //8

      expect(await cryptoplazaNFT.tokenURI(1)).to.equal(BASE_URI.concat("1").concat("/8"))
      expect(await cryptoplazaNFT.tokenURI(2)).to.equal(BASE_URI.concat("1").concat("/7"))
      expect(await cryptoplazaNFT.tokenURI(3)).to.equal(BASE_URI.concat("1").concat("/6"))
      expect(await cryptoplazaNFT.tokenURI(4)).to.equal(BASE_URI.concat("1").concat("/5"))
      expect(await cryptoplazaNFT.tokenURI(5)).to.equal(BASE_URI.concat("1").concat("/4"))
      expect(await cryptoplazaNFT.tokenURI(6)).to.equal(BASE_URI.concat("1").concat("/3"))
      expect(await cryptoplazaNFT.tokenURI(7)).to.equal(BASE_URI.concat("1").concat("/2"))
      expect(await cryptoplazaNFT.tokenURI(8)).to.equal(BASE_URI.concat("1").concat("/1"))


    });

    it("Should be remove from list position when burn", async function () {
      const { cryptoplazaNFT, owner, otherAccount, otherAccount1, account2, account3, account4, account5, account6 } = await loadFixture(initialSetUp)

      const tenureNow = (await ethers.provider.getBlock("latest")).timestamp
      const tenure1 = tenureNow - 1
      const tenure2 = tenureNow - 2
      const tenure3 = tenureNow - 3
      const tenure4 = tenureNow - 4
      const tenure5 = tenureNow - 5
      const tenure6 = tenureNow - 6
      const tenure7 = tenureNow - 7

      await (await cryptoplazaNFT.connect(owner).safeMint(owner.address,tenureNow)).wait(1)        //1
      await (await cryptoplazaNFT.connect(owner).safeMint(otherAccount.address, tenure1)).wait(1)  //2
      await (await cryptoplazaNFT.connect(owner).safeMint(otherAccount1.address, tenure2)).wait(1) //3
      await (await cryptoplazaNFT.connect(owner).safeMint(account2.address, tenure3)).wait(1)      //4
      await (await cryptoplazaNFT.connect(owner).safeMint(account4.address, tenure4)).wait(1)      //5
      await (await cryptoplazaNFT.connect(owner).safeMint(account3.address, tenure5)).wait(1)      //6
      await (await cryptoplazaNFT.connect(owner).safeMint(account5.address, tenure6)).wait(1)      //7
      await (await cryptoplazaNFT.connect(owner).safeMint(account6.address, tenure7)).wait(1)      //8

      expect(await cryptoplazaNFT.tokenURI(1)).to.equal(BASE_URI.concat("1").concat("/8"))
      expect(await cryptoplazaNFT.tokenURI(2)).to.equal(BASE_URI.concat("1").concat("/7"))
      expect(await cryptoplazaNFT.tokenURI(3)).to.equal(BASE_URI.concat("1").concat("/6"))
      expect(await cryptoplazaNFT.tokenURI(4)).to.equal(BASE_URI.concat("1").concat("/5"))
      expect(await cryptoplazaNFT.tokenURI(5)).to.equal(BASE_URI.concat("1").concat("/4"))
      expect(await cryptoplazaNFT.tokenURI(6)).to.equal(BASE_URI.concat("1").concat("/3"))
      expect(await cryptoplazaNFT.tokenURI(7)).to.equal(BASE_URI.concat("1").concat("/2"))
      expect(await cryptoplazaNFT.tokenURI(8)).to.equal(BASE_URI.concat("1").concat("/1"))


      await (await cryptoplazaNFT.connect(owner).burn(8)).wait(1)
      expect(await cryptoplazaNFT.tokenURI(1)).to.equal(BASE_URI.concat("1").concat("/7"))
      expect(await cryptoplazaNFT.tokenURI(2)).to.equal(BASE_URI.concat("1").concat("/6"))
      expect(await cryptoplazaNFT.tokenURI(3)).to.equal(BASE_URI.concat("1").concat("/5"))
      expect(await cryptoplazaNFT.tokenURI(4)).to.equal(BASE_URI.concat("1").concat("/4"))
      expect(await cryptoplazaNFT.tokenURI(5)).to.equal(BASE_URI.concat("1").concat("/3"))
      expect(await cryptoplazaNFT.tokenURI(6)).to.equal(BASE_URI.concat("1").concat("/2"))
      expect(await cryptoplazaNFT.tokenURI(7)).to.equal(BASE_URI.concat("1").concat("/1"))


      await (await cryptoplazaNFT.connect(owner).burn(4)).wait(1)
      expect(await cryptoplazaNFT.tokenURI(1)).to.equal(BASE_URI.concat("1").concat("/6"))
      expect(await cryptoplazaNFT.tokenURI(2)).to.equal(BASE_URI.concat("1").concat("/5"))
      expect(await cryptoplazaNFT.tokenURI(3)).to.equal(BASE_URI.concat("1").concat("/4"))
      expect(await cryptoplazaNFT.tokenURI(5)).to.equal(BASE_URI.concat("1").concat("/3"))
      expect(await cryptoplazaNFT.tokenURI(6)).to.equal(BASE_URI.concat("1").concat("/2"))
      expect(await cryptoplazaNFT.tokenURI(7)).to.equal(BASE_URI.concat("1").concat("/1"))
 


    });

    it("Should be displayed the member number according to the token position in the tokenIdSortedByTenure list", async function () {
      const { cryptoplazaNFT, owner, otherAccount, otherAccount1, account2, account3, account4, account5, account6 } = await loadFixture(initialSetUp)

      const tenureNow = (await ethers.provider.getBlock("latest")).timestamp //8
      //2020/1/1 01:01:01
      const tenure2020 = 1577836861   //7
      const tenure2019 = 1546300861   //6
      const tenure2018 = 1514764861   //5
      const tenure2017 = 1483228861   //4
      const tenure2016 = 1451606461   //3
      const tenure2015 = 1420070461   //2
      const tenure2014 = 1388534461   //1

      await (await cryptoplazaNFT.connect(owner).safeMint(owner.address,tenure2014)).wait(1)          //1
      await (await cryptoplazaNFT.connect(owner).safeMint(otherAccount.address, tenure2020)).wait(1)  //2
      await (await cryptoplazaNFT.connect(owner).safeMint(otherAccount1.address, tenure2019)).wait(1) //3
      await (await cryptoplazaNFT.connect(owner).safeMint(account2.address, tenure2018)).wait(1)      //4
      await (await cryptoplazaNFT.connect(owner).safeMint(account4.address, tenure2016)).wait(1)      //5
      await (await cryptoplazaNFT.connect(owner).safeMint(account3.address, tenure2017)).wait(1)      //6
      await (await cryptoplazaNFT.connect(owner).safeMint(account5.address, tenure2015)).wait(1)      //7
      await (await cryptoplazaNFT.connect(owner).safeMint(account6.address, tenureNow)).wait(1)       //8

      expect(await cryptoplazaNFT.tokenURI(1)).to.equal(BASE_URI.concat("3").concat("/1"))
      expect(await cryptoplazaNFT.tokenURI(2)).to.equal(BASE_URI.concat("2").concat("/7"))
      expect(await cryptoplazaNFT.tokenURI(3)).to.equal(BASE_URI.concat("2").concat("/6"))
      expect(await cryptoplazaNFT.tokenURI(4)).to.equal(BASE_URI.concat("3").concat("/5"))
      expect(await cryptoplazaNFT.tokenURI(5)).to.equal(BASE_URI.concat("3").concat("/3"))
      expect(await cryptoplazaNFT.tokenURI(6)).to.equal(BASE_URI.concat("3").concat("/4"))
      expect(await cryptoplazaNFT.tokenURI(7)).to.equal(BASE_URI.concat("3").concat("/2"))
      expect(await cryptoplazaNFT.tokenURI(8)).to.equal(BASE_URI.concat("1").concat("/8"))

    });
  });
});
