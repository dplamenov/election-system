import './App.css';
import { useEffect, useState } from 'react';
import {useContract, useProvider} from './hooks/web3';
import {ethers} from 'ethers';

function App() {
  const electionContract = useContract('election');
  const [proposals, setProposals] = useState([]);
  const [currentAccount, setCurrentAccount] = useState()
  const [isOwner, setIsOwner] = useState(false);

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

  return (
    <div className="App">
      <h1>Proposals</h1>
      {proposals.map(p => {
        return <p key={p.name}>{ethers.utils.parseBytes32String(p.name)}</p>
      })}
      <hr></hr>
      {isOwner && <>
        <form onSubmit={giveRightToVoteHandler}>
          <input type="text" placeholder="address" id="address" name="address" />
          <button>Give right</button>
        </form>
        
      </>}
    </div>
  );
}

export default App;
