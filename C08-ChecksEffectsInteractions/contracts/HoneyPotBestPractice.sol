// Modified from: 
// https://medium.com/@gus_tavo_guim/reentrancy-attack-on-smart-contracts-how-to-identify-the-exploitable-and-an-example-of-an-attack-4470a2d8dfe4

pragma solidity ^0.4.23;

import "./HoneyPot.sol";

contract HoneyPotBestPractice is HoneyPot{

    constructor() payable public {
        put();
    }

    // 複寫 (overriding) get() 函數
    function get() public {
        // Best Practice 最佳實踐就是採用Withdraw Pattern

        // Checks
        assert(balances[msg.sender] > 0);
        // Effects
        uint256 value = balances[msg.sender];
        balances[msg.sender] = 0;
        // Interactions
        msg.sender.transfer(value);
    }
}