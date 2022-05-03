import './App.css';
import { useEffect, useState } from 'react';
import {useContract, useProvider} from './hooks/web3';
import {ethers} from 'ethers';

function App() {
  const provider = useProvider();
  const electionContract = useContract('election');
  const [proposals, setProposals] = useState([]);

  const getProposals = async () => {
    const proposals = await electionContract.getProposals();
    console.log(proposals);
    setProposals(proposals);
  };

  useEffect(() => {
    if(electionContract) {
      getProposals();
    }
  }, []);

  return (
    <div className="App">
      <h1>Proposals</h1>
      {proposals.map(p => {
        return <p key={p.name}>{ethers.utils.parseBytes32String(p.name)}</p>
      })}
    </div>
  );
}

export default App;
