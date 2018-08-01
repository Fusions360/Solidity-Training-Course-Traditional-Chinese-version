// Modified from: 
// https://medium.com/@gus_tavo_guim/reentrancy-attack-on-smart-contracts-how-to-identify-the-exploitable-and-an-example-of-an-attack-4470a2d8dfe4

pragma solidity ^0.4.23;

import "./HoneyPot.sol";

contract HoneyPotCEI is HoneyPot {

    constructor() payable public {
        put();
    }

    // 複寫 (overriding) get() 函數
    function get() public {
        // Effects
        balances[msg.sender] = 0;
        // Interactions        
        // solium-disable-next-line
        if (!msg.sender.call.value(balances[msg.sender])()) {
            revert();
        }
    }
}