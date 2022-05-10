import { ethers } from "ethers"; 
import { useContract } from '../hooks/web3';

function Proposal({ proposal, id, isVoted }) {
  const electionContract = useContract('election');

  const voteHandler = (key) => {
    return () => {
      electionContract.vote(key).then(() => {
        console.log(key);
      });
    }
  };

  return (
    <div>
      <h2>{ethers.utils.parseBytes32String(proposal.name)}</h2>
      {!isVoted && <button onClick={voteHandler(id)}>Vote</button>}
    </div>
  );
}

export default Proposal;