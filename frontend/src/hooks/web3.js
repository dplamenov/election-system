import {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import { contracts } from '../contracts'
import { store as providerStore } from '../store';

const contractsInstances = {

};

function useContract(contractName) {
  const [contract, setContract] = useState();
  const provider = providerStore.getState().provider;
  useEffect(() => {
    if(provider) {
      const signer = provider.getSigner();
      
      if (!contractsInstances[contractName]) {
        contractsInstances[contractName] = new ethers.Contract(contracts[contractName].address, contracts[contractName].abi, signer);
      }
      
      setContract(contractsInstances[contractName]);
    }
  }, [provider, contractName]);

  return contract;
}

async function connect() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const address = await provider.send("eth_requestAccounts", []);

  providerStore.dispatch({ type: 'set', payload: { provider, address: address[0]}});
}

export { useContract, connect };