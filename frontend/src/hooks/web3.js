import {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import { contracts } from '../contracts'

function useProvider() {
  const [provider, setProvider] = useState();

  useEffect(() => {
   async function connect() {
     const provider = new ethers.providers.Web3Provider(window.ethereum)
     await provider.send("eth_requestAccounts", []);
     setProvider(provider);
   }

   if(!provider) {
     connect();
   }
  });

  return provider;
}

function useContract(contractName) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  return new ethers.Contract(contracts[contractName].address, contracts[contractName].abi, signer);
}

export { useProvider, useContract };