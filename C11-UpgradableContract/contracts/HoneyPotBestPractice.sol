// Modified from: 
// https://medium.com/@gus_tavo_guim/reentrancy-attack-on-smart-contracts-how-to-identify-the-exploitable-and-an-example-of-an-attack-4470a2d8dfe4

pragma solidity ^0.4.23;

import "./HoneyPot.sol";

contract HoneyPotBestPractice is HoneyPot {

    constructor() payable public {
        // 在可更新合約的實作中，建構函數不能操作state
    }

    function get() public {
        // Best Practice 最佳實踐就是採用Withdraw Pattern

        // Checks
        uint256 value = _storage.getMap("balances", msg.sender);
        assert(value > 0);
        // Effects
        _storage.setMap("balances", msg.sender, 0);
        // Interactions
        msg.sender.transfer(value);
    }
}