// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ITokenizedVotes {
    function getPastVotes(address, uint256) external view returns (uint256);
}

contract TokenizedBallot {
    uint256 public referenceBlock;
    ITokenizedVotes public tokenContract;


    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    Proposal[] public proposals;
    mapping(address => uint256) public votePowerSpent;

    constructor(bytes32[] memory proposalNames, address _voteTokenContract, uint256 _referenceBlock) {
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({ name: proposalNames[i], voteCount: 0 }));
        }
        tokenContract = ITokenizedVotes(_voteTokenContract);
        referenceBlock = _referenceBlock;
    }

/// I can vote to a proposal and vote that amount in that proposal if I have 100 votes I can divide 50 votes for 1 50 votes for other
    function vote(uint256 proposal, uint256 amount) public {
        uint256 votingPower = votePower(msg.sender);
        require(votingPower >= amount, "TokenizedBallot: Trying to vote with more vote than vote power available for this account");
        votePowerSpent[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
    }

    function votePower(address account) public view returns (uint256 votePower_) {
        votePower_ = tokenContract.getPastVotes(account, referenceBlock) - votePowerSpent[account];
    }

    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}