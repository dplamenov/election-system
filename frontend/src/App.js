import './App.css';
import { useEffect, useState } from 'react';
import {useContract } from './hooks/web3';
import Button from "./components/Button";
import Proposal from './components/Proposal';
import { store as providerStore } from './store';

function App() {
  const electionContract = useContract('election');
  const [proposals, setProposals] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isVoted, setIsVoted] = useState(false); 

  useEffect(() => {
    if (electionContract) {
      getProposals();
      Promise.all([electionContract.owner(), electionContract.voters(providerStore.getState().address)]).then(([owner, voter]) => {
        setIsVoted(voter.voted);
        setIsOwner(owner.toLowerCase() === providerStore.getState().address);
      });

      electionContract.on('Vote', (voter) => {
        console.log(voter);
        setIsVoted(true);
      });
    }
  }, [electionContract])

  const getProposals = async () => {
    const proposals = await electionContract.getProposals();
    setProposals(proposals);
  };

  const giveRightToVoteHandler = async (e) => {
    e.preventDefault();
    const {value: address} = e.target.address;
    electionContract.giveRightToVote(address);
  }

  return (
    <div className="App">
      <h1 style={{ color: 'palevioletred' }}>Proposals</h1>
      {isVoted && <p>already voted</p>}
      {proposals.map((p, key) => {
        return <Proposal key={key} proposal={p} id={key} isVoted={isVoted} />
      })}
      {isOwner && <>
        <h2>Owner panel:</h2>
        <form onSubmit={giveRightToVoteHandler}>
          <input type="text" placeholder="address" id="address" name="address" />
          <Button>Give right</Button>
        </form>
        <Button>Get result</Button>
      </>}
    </div>
  );
}

export default App;
