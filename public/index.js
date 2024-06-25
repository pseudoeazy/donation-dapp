var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Web3 } from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
var view = {
    connectEl: document.getElementById('connect'),
    senderEl: document.getElementById('sender'),
    recipientEl: document.getElementById('recipient'),
    amountEl: document.getElementById('amount'),
    donateEl: document.getElementById('donate'),
    donationRaisedEl: document.getElementById('donationRaised'),
    withdrawEl: document.getElementById('withdraw'),
    balanceEl: document.getElementById('balance'),
};
function toggleDisabled(isEnabled) {
    view.senderEl.disabled =
        view.recipientEl.disabled =
            view.amountEl.disabled =
                view.donateEl.disabled =
                    isEnabled;
}
function getContractAddress() {
    return '0x6d212029F6F378bFC75582546888BF3145ED57F1';
}
function connectToMetaMask() {
    return __awaiter(this, void 0, void 0, function () {
        var provider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, detectEthereumProvider()];
                case 1:
                    provider = _a.sent();
                    if (provider) {
                        if (window.ethereum) {
                            try {
                                window.web3 = new Web3(window.ethereum);
                                console.log('Connected to MetaMask');
                            }
                            catch (error) {
                                alert(error.message);
                                console.error('User denied account access', error);
                            }
                        }
                        else {
                            // Set the provider you want from Web3.providers
                            // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
                            console.error('Non-MetaMask browser detected. You should consider trying MetaMask!');
                            alert('Non-MetaMask browser detected. You should consider trying MetaMask!');
                        }
                    }
                    else {
                        // Non-dapp browsers
                        console.error('No Ethereum provider detected. Install MetaMask.');
                        alert('No Ethereum provider detected. Install MetaMask.');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function requestAccountAccess() {
    return __awaiter(this, void 0, void 0, function () {
        var accounts, account;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, window.ethereum.request({
                        method: 'eth_requestAccounts',
                    })];
                case 1:
                    accounts = _a.sent();
                    account = accounts[0];
                    if (!account) return [3 /*break*/, 3];
                    return [4 /*yield*/, getOwnerAddress()];
                case 2:
                    _a.sent();
                    view.senderEl.value = account;
                    view.connectEl.classList.add('hide');
                    toggleDisabled(false);
                    return [2 /*return*/, account];
                case 3:
                    alert('Account Not Found!');
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fetchAbiFile() {
    return __awaiter(this, void 0, void 0, function () {
        var abiFilePath, response, contractAbi, contractAbiNetworks, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    abiFilePath = '/build/contracts/Donation.json';
                    return [4 /*yield*/, fetch(abiFilePath)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    contractAbi = _a.sent();
                    contractAbiNetworks = contractAbi.networks;
                    console.log({
                        contractAbi: contractAbi,
                    });
                    return [2 /*return*/, {
                            abi: contractAbi.abi,
                            address: contractAbiNetworks['5777']['address'],
                        }];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error fetching the file:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getContract(web3) {
    return __awaiter(this, void 0, void 0, function () {
        var contractAbiFile, contractInstance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchAbiFile()];
                case 1:
                    contractAbiFile = _a.sent();
                    contractInstance = new web3.eth.Contract(contractAbiFile.abi, contractAbiFile.address);
                    return [2 /*return*/, contractInstance];
            }
        });
    });
}
function donateEther() {
    return __awaiter(this, void 0, void 0, function () {
        var web3, donationContract, accounts, fromAddress, amount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    web3 = new Web3(window.ethereum);
                    return [4 /*yield*/, getContract(web3)];
                case 1:
                    donationContract = _a.sent();
                    return [4 /*yield*/, web3.eth.getAccounts()];
                case 2:
                    accounts = _a.sent();
                    fromAddress = accounts[0];
                    amount = view.amountEl.value;
                    console.log({ fromAddress: fromAddress, amount: amount });
                    toggleDisabled(true);
                    return [4 /*yield*/, donationContract.methods.donate().send({
                            from: fromAddress,
                            value: web3.utils.toWei(amount, 'ether'),
                        })];
                case 3:
                    _a.sent();
                    toggleDisabled(false);
                    return [2 /*return*/];
            }
        });
    });
}
// check contract balance
function checkContractBalance() {
    return __awaiter(this, void 0, void 0, function () {
        var web3, donationContract, balance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    web3 = new Web3(window.ethereum);
                    return [4 /*yield*/, getContract(web3)];
                case 1:
                    donationContract = _a.sent();
                    return [4 /*yield*/, donationContract.methods.contractBalance().call()];
                case 2:
                    balance = _a.sent();
                    console.log('Contract Balance:', balance, 'ETH');
                    return [2 /*return*/];
            }
        });
    });
}
// withdraw funds (only the owner can do this)
function withdraw() {
    return __awaiter(this, void 0, void 0, function () {
        var web3, donationContract, ownerAddress, amount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    web3 = new Web3(window.ethereum);
                    return [4 /*yield*/, getContract(web3)];
                case 1:
                    donationContract = _a.sent();
                    return [4 /*yield*/, getOwnerAddress()];
                case 2:
                    ownerAddress = _a.sent();
                    amount = view.amountEl.value;
                    return [4 /*yield*/, donationContract.methods
                            .withdraw(web3.utils.toWei(amount, 'ether'))
                            .send({
                            from: ownerAddress,
                        })];
                case 3:
                    _a.sent();
                    console.log('Withdrawal successful!');
                    return [2 /*return*/];
            }
        });
    });
}
function listenForContractEvents() {
    return __awaiter(this, void 0, void 0, function () {
        var web3, donationContract;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    web3 = new Web3(window.ethereum);
                    return [4 /*yield*/, getContract(web3)];
                case 1:
                    donationContract = _a.sent();
                    donationContract.events.DonationReceived().on('data', function (event) {
                        console.log('Donation Received:', event.returnValues);
                    });
                    donationContract.events.DonationReceived().on('error', function (error) {
                        console.error(error);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function getOwnerAddress() {
    return __awaiter(this, void 0, void 0, function () {
        var web3, donationContract, ownerAddress, _a, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    web3 = new Web3(window.ethereum);
                    return [4 /*yield*/, getContract(web3)];
                case 1:
                    donationContract = _b.sent();
                    _a = window.ownerAddress;
                    if (_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, donationContract.methods.owner().call()];
                case 2:
                    _a = (_b.sent());
                    _b.label = 3;
                case 3:
                    ownerAddress = _a;
                    view.recipientEl.value = ownerAddress;
                    window.ownerAddress = ownerAddress;
                    console.log("Owner Address: ".concat(ownerAddress));
                    return [2 /*return*/, ownerAddress];
                case 4:
                    error_2 = _b.sent();
                    console.error('Error fetching owner address:', error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
listenForContractEvents();
window.addEventListener('load', connectToMetaMask);
view.connectEl.addEventListener('click', requestAccountAccess);
view.donateEl.addEventListener('click', donateEther);
view.withdrawEl.addEventListener('click', withdraw);
view.balanceEl.addEventListener('click', checkContractBalance);
//# sourceMappingURL=index.js.map