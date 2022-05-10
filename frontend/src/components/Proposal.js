import { ethers } from "ethers"; 
import { useContract } from '../hooks/web3';
import Button from "./Button";

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
      <h2 style={{display: 'inline'}}>{ethers.utils.parseBytes32String(proposal.name)}</h2>
      {!isVoted && <Button onClick={voteHandler(id)}>Vote</Button>}
    </div>
  );
}

export default Proposal;