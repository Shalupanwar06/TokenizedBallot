import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const TOKENS_MINTED = ethers.utils.parseEther("1");

async function main() {
    const [deployer, account1, account2] = await ethers.getSigners();
    const myErc20VoteFactory = await ethers.getContractFactory("MyERC20Vote");
    const myErc20Vote = await myErc20VoteFactory.deploy();
    await myErc20Vote.deployed();
    console.log(`My token contract was deployed at the address of ${myErc20Vote.address}`);
    const totalSupply = await myErc20Vote.totalSupply();
    console.log(`The initial total supply of this contract after deployment is ${totalSupply}`);
    console.log("Minting new tokens for Account 1");
    const mintTx = await myErc20Vote.mint(account1.address, TOKENS_MINTED);
    await mintTx.wait();
    const totalSupplyAfterMint = await myErc20Vote.totalSupply();
    console.log(`The total supply of this contract after minting is ${ethers.utils.formatEther(totalSupplyAfterMint)}`);
    const account1BalanceAfterMint = await myErc20Vote.balanceOf(account1.address);
    console.log(`The token balance of account 1 after minting is ${ethers.utils.formatEther(account1BalanceAfterMint)}`);
    console.log("What is the current vote power of account 1");
    const account1InitVotingPowerAfterMint = await myErc20Vote.getVotes(account1.address);
    console.log(`The vote balance of account 1 after minting is ${ethers.utils.formatEther(account1InitVotingPowerAfterMint)}`);
    console.log("Delegating from account 1 to account 1")
    const delegateTx = await myErc20Vote.connect(account1).delegate(account1.address);
    await delegateTx.wait();
    const account1VotingPowerAfterDelegation = await myErc20Vote.getVotes(account1.address);
    console.log(`Voting power of account 1 after self-delegation is ${ethers.utils.formatEther(account1VotingPowerAfterDelegation)}`);
    const currentBlock = await ethers.provider.getBlock("latest");
    console.log(`The current block number is ${currentBlock.number}`);
    const mintTx2 = await myErc20Vote.mint(account2.address, TOKENS_MINTED);
    await mintTx2.wait();
    const currentBlock2 = await ethers.provider.getBlock("latest");
    console.log(`The current block number is ${currentBlock2.number}`);
    const mintTx3 = await myErc20Vote.mint(account2.address, TOKENS_MINTED);
    await mintTx3.wait();
    const currentBlock3 = await ethers.provider.getBlock("latest");
    console.log(`The current block number is ${currentBlock3.number}`);
    /// Get result from a lot of Promises at once
    const pastVotesAcc1 = await Promise.all([
        await myErc20Vote.getPastVotes(account1.address, 4),
        await myErc20Vote.getPastVotes(account1.address, 3),
        await myErc20Vote.getPastVotes(account1.address, 2),
        await myErc20Vote.getPastVotes(account1.address, 1),
        await myErc20Vote.getPastVotes(account1.address, 0),
    ]);
    console.log({ pastVotesAcc1 })
} 

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});