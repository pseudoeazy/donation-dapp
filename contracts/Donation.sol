// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Donation {
    address public owner;
    mapping(address => uint) public balances;
    event DonationReceived(address indexed donor, uint amount, bytes data);

    constructor() {
        owner = msg.sender;
    }

    function donate() public payable {
        require(msg.value > 0, "Donation must be greater than 0");

        balances[msg.sender] += msg.value; // Update the donor's balance
        emit DonationReceived(msg.sender, msg.value, msg.data);
    }

    // Withdraw Ether from the contract, only callable by the owner
    function withdraw(uint amount) public {
        require(msg.sender == owner, "Only the owner can withdraw");
        require(address(this).balance >= amount, "Insufficient balance");

        payable(owner).transfer(amount); // Transfer the specified amount to the owner
    }

    // Retrieve message details without msg.value
    function getMessageDetails()
        public
        view
        returns (address, bytes memory, bytes4)
    {
        return (msg.sender, msg.data, msg.sig);
    }

    // Handle direct Ether transfers
    receive() external payable {
        donate(); // Calls the donate function when Ether is sent directly to the contract
    }

    // Fallback function to handle other calls
    fallback() external payable {
        donate(); // Calls the donate function when Ether is sent directly to the contract
    }

    // Function to check contract balance
    function contractBalance() public view returns (uint) {
        return address(this).balance;
    }
}
