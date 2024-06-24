import { Web3 } from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

declare global {
  interface Window {
    ethereum?: any;
    web3?: Web3;
  }
}

const view = {
  connectEl: document.getElementById('connect') as HTMLInputElement,
  senderEl: document.getElementById('sender') as HTMLInputElement,
  recipientEl: document.getElementById('recipient') as HTMLInputElement,
  amountEl: document.getElementById('amount') as HTMLInputElement,
};

async function requestAccountAcess() {
  const account = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  console.log({ account });
}

const connectToMetaMask = async (): Promise<void> => {
  const provider = await detectEthereumProvider();

  if (provider) {
    // Modern dapp browsers...
    if (window.ethereum) {
      try {
        window.web3 = new Web3(window.ethereum);
        console.log('Connected to MetaMask');
      } catch (error) {
        // User denied account access
        // alert(error.message);
        console.error('User denied account access', error);
      }
    } else {
      //---set the provider you want from Web3.providers---
      //   web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
      console.error(
        'Non-MetaMask browser detected. You should consider trying MetaMask!'
      );
      alert(
        'Non-MetaMask browser detected. You should consider trying MetaMask!'
      );
    }
  } else {
    // Non-dapp browsers
    console.error('No Ethereum provider detected. Install MetaMask.');
    alert('No Ethereum provider detected. Install MetaMask.');
  }
};

window.addEventListener('load', connectToMetaMask);
view.connectEl.addEventListener('click', requestAccountAcess);
