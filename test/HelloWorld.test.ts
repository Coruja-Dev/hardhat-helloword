import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect, assert } from "chai";
import hre from "hardhat";

describe("HelloWorld", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {

    const [owner, otherAccount] = await hre.ethers.getSigners();

    const HelloWorld = await hre.ethers.getContractFactory("HelloWorld");
    const helloWorld = await HelloWorld.deploy();

    return { helloWorld, owner, otherAccount };
  }

  it("Should Hello World", async function () {
    const { helloWorld, owner, otherAccount } = await loadFixture(deployFixture);

    const message = await helloWorld.message();

    expect(message).to.equal("Hello World");
  });

  it("Should New Message", async function () {
    const { helloWorld, owner, otherAccount } = await loadFixture(deployFixture);

    await helloWorld.setMessage("new message");

    const message = await helloWorld.message();

    expect(message).to.equal("new message");
  });

  it('should update the message multiple times', async () => {
    const { helloWorld } = await deployFixture()

    await helloWorld.setMessage('First Update')
    expect(await helloWorld.message()).to.equal('First Update')

    await helloWorld.setMessage('Second Update')
    expect(await helloWorld.message()).to.equal('Second Update')
  })


  /*
  Since there's no access control, anyone can call setMessage(). You can verify this:
  */
  it('should allow other accounts to update the message', async () => {
    const { helloWorld, otherAccount } = await deployFixture()

    await helloWorld.connect(otherAccount).setMessage('From other account')
    const result = await helloWorld.message()

    expect(result).to.equal('From other account')
  })
});
