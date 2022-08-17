//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

contract PiggyBank{

    event Deposit(uint indexed amount);
    event Withdraw(uint indexed amount);

    receive() external payable {
        emit Deposit(msg.value);
    }

    address public owner;
    
    constructor(){
        owner = msg.sender;
    }

    function withdraw() external{
        require(msg.sender ==owner ,"not owner");
        emit Withdraw(address(this).balance);
        selfdestruct(payable(owner));
    }
    
    function contractBalance() external view  returns(uint){
        return address(this).balance;
    }
}
