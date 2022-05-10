import './App.css';
import { useEffect, useState } from 'react';
import {useContract, useProvider} from './hooks/web3';
import {ethers} from 'ethers';
import Proposal from './components/Proposal';

function App() {
  const electionContract = useContract('election');
  const [proposals, setProposals] = useState([]);
  const [currentAccount, setCurrentAccount] = useState()
  const [isOwner, setIsOwner] = useState(false);
  const [isVoted, setIsVoted] = useState(false); 

  useEffect(() => {
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(result => {
        setCurrentAccount(result[0]);

        if (electionContract) {
          getProposals();
          Promise.all([electionContract.owner(), electionContract.voters(result[0])]).then(([owner, voter]) => {
            setIsVoted(voter.voted);
            setIsOwner(owner.toLowerCase() === result[0]);
          });
        }
      });
  }, [])

  const getProposals = async () => {
    const proposals = await electionContract.getProposals();
    setProposals(proposals);
  };

  const giveRightToVoteHandler = async (e) => {
    console.log(isOwner);
    e.preventDefault();
    const {value: address} = e.target.address;
    electionContract.giveRightToVote(address);
  }

 

  return (
    <div className="App">
      <h1>Proposals</h1>
      {proposals.map((p, key) => {
        return <Proposal key={key} proposal={p} id={key} isVoted={isVoted}>
        </Proposal>
      })}
      <hr></hr>
      {isOwner && <>
        <form onSubmit={giveRightToVoteHandler}>
          <input type="text" placeholder="address" id="address" name="address" />
          <button>Give right</button>
        </form>
        <button>Get result</button>
      </>}
    </div>
  );
}

export default App;
