import { Web3 } from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

declare global {
  interface Window {
    ethereum?: any;
    web3?: Web3;
    ownerAddress?: string;
  }
}

const view = {
  connectEl: document.getElementById('connect') as HTMLInputElement,
  senderEl: document.getElementById('sender') as HTMLInputElement,
  recipientEl: document.getElementById('recipient') as HTMLInputElement,
  amountEl: document.getElementById('amount') as HTMLInputElement,
  donateEl: document.getElementById('donate') as HTMLButtonElement,
  donationRaisedEl: document.getElementById(
    'donationRaised'
  ) as HTMLSpanElement,
  withdrawEl: document.getElementById('withdraw') as HTMLButtonElement,
  balanceEl: document.getElementById('balance') as HTMLButtonElement,
};

function toggleDisabled(isEnabled: boolean) {
  view.senderEl.disabled =
    view.recipientEl.disabled =
    view.amountEl.disabled =
    view.donateEl.disabled =
      isEnabled;
}

function getContractAddress() {
  return '0x6d212029F6F378bFC75582546888BF3145ED57F1';
}

async function connectToMetaMask(): Promise<void> {
  const provider = await detectEthereumProvider();

  if (provider) {
    if (window.ethereum) {
      try {
        window.web3 = new Web3(window.ethereum);
        console.log('Connected to MetaMask');
      } catch (error) {
        alert(error.message);
        console.error('User denied account access', error);
      }
    } else {
      // Set the provider you want from Web3.providers
      // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
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
}

async function requestAccountAccess(): Promise<string | undefined> {
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  const account = accounts[0];

  if (account) {
    await getOwnerAddress();
    view.senderEl.value = account;
    view.connectEl.classList.add('hide');
    toggleDisabled(false);

    return account;
  } else {
    alert('Account Not Found!');
  }
}

async function fetchAbiFile(): Promise<
  { abi: any; address: string } | undefined
> {
  try {
    const abiFilePath = '/Donation.json';
    const response = await fetch(abiFilePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contractAbi = await response.json();
    const contractAbiNetworks = contractAbi.networks;
    console.log({
      contractAbi,
    });
    return {
      abi: contractAbi.abi,
      address: contractAbiNetworks['5777']['address'],
    };
  } catch (error) {
    console.error('Error fetching the file:', error);
  }
}

async function getContract(web3: Web3) {
  const contractAbiFile = await fetchAbiFile();
  const contractInstance = new web3.eth.Contract(
    contractAbiFile.abi,
    contractAbiFile.address
  );
  return contractInstance;
}

async function donateEther() {
  const web3 = new Web3(window.ethereum);
  const donationContract = await getContract(web3);
  const accounts = await web3.eth.getAccounts();
  const fromAddress = accounts[0];
  const amount = view.amountEl.value;
  console.log({ fromAddress, amount });

  toggleDisabled(true);
  await donationContract.methods.donate().send({
    from: fromAddress,
    value: web3.utils.toWei(amount, 'ether'),
  });

  toggleDisabled(false);
}

// check contract balance
async function checkContractBalance() {
  const web3 = new Web3(window.ethereum);
  const donationContract = await getContract(web3);
  const balance = await donationContract.methods.contractBalance().call();
  console.log('Contract Balance:', balance, 'ETH');
}

// withdraw funds (only the owner can do this)
async function withdraw() {
  const web3 = new Web3(window.ethereum);
  const donationContract = await getContract(web3);
  const ownerAddress = await getOwnerAddress();
  const amount = view.amountEl.value;

  await donationContract.methods
    .withdraw(web3.utils.toWei(amount, 'ether'))
    .send({
      from: ownerAddress,
    });

  console.log('Withdrawal successful!');
}

async function listenForContractEvents() {
  const web3 = new Web3(window.ethereum);
  const donationContract = await getContract(web3);

  donationContract.events.DonationReceived().on('data', (event) => {
    console.log('Donation Received:', event.returnValues);
  });

  donationContract.events.DonationReceived().on('error', function (error) {
    console.error(error);
  });
}

async function getOwnerAddress(): Promise<string> {
  try {
    const web3 = new Web3(window.ethereum);
    const donationContract = await getContract(web3);
    const ownerAddress: string =
      window.ownerAddress || (await donationContract.methods.owner().call());
    view.recipientEl.value = ownerAddress;
    window.ownerAddress = ownerAddress;

    console.log(`Owner Address: ${ownerAddress}`);
    return ownerAddress;
  } catch (error) {
    console.error('Error fetching owner address:', error);
  }
}

listenForContractEvents();
window.addEventListener('load', connectToMetaMask);
view.connectEl.addEventListener('click', requestAccountAccess);
view.donateEl.addEventListener('click', donateEther);
view.withdrawEl.addEventListener('click', withdraw);
view.balanceEl.addEventListener('click', checkContractBalance);
