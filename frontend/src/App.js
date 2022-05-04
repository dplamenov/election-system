import './App.css';
import { useEffect, useState } from 'react';
import {useContract, useProvider} from './hooks/web3';
import {ethers} from 'ethers';

function App() {
  const electionContract = useContract('election');
  const [proposals, setProposals] = useState([]);
  const [currentAccount, setCurrentAccount] = useState()
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(result => {
        setCurrentAccount(result[0]);

        if (electionContract) {
          getProposals();
          electionContract.owner().then(owner => {
            setIsOwner(owner.toLowerCase() === result[0]);
          });
        }
      });
  }, [])

  const getProposals = async () => {
    const proposals = await electionContract.getProposals();
    console.log(proposals);
    setProposals(proposals);
  };

  const giveRightToVoteHandler = async (e) => {
    console.log(isOwner);
    e.preventDefault();
    const {value: address} = e.target.address;
    electionContract.giveRightToVote(address);
  }

  const voteHandler = (key) => {
    return () => {
      electionContract.vote(key).then(() => {
        console.log(key);
      });
    }
  };

  return (
    <div className="App">
      <h1>Proposals</h1>
      {proposals.map((p, key) => {
        return <div key={key}>
          {ethers.utils.parseBytes32String(p.name)}
          <button onClick={voteHandler(key)}>Vote</button>
        </div>
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
