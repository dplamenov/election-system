//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Election {
    struct Voter {
        uint256 weight;
        bool voted;
        address delegate;
        uint256 vote;
    }

    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    address owner;
    mapping(address => Voter) voters;
    Proposal[] proposals;

    modifier isOwner() {
        require(msg.sender == owner, "Only owner can give right to vote.");
        _;
    }

    constructor(bytes32[] memory proposalNames) {
        owner = msg.sender;
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function giveRightToVote(address voter) public isOwner {
        require(!voters[voter].voted, "The voter already voted.");
        voters[voter].voted = false;
    }

    function vote(uint256 proposal) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "already voted");
        sender.voted = true;
        sender.vote = proposal;
        proposals[proposal].voteCount += 1;
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

    function winnerName() public view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }
}
