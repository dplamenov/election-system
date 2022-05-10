import { ethers } from "ethers"; 
import { useContract } from '../hooks/web3';
import styled from 'styled-components'

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin: 0.5em 1em;
  padding: 0.25em 1em;
`

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
      {!isVoted && <Button onClick={voteHandler(id)}>Vote</Button>}
    </div>
  );
}

export default Proposal;