// Modified from: 
// https://medium.com/@gus_tavo_guim/reentrancy-attack-on-smart-contracts-how-to-identify-the-exploitable-and-an-example-of-an-attack-4470a2d8dfe4

pragma solidity ^0.4.23;

contract HoneyPot {
    mapping (address => uint) public balances;
    constructor() payable public {
        put();
    }
    function put() payable public {
        balances[msg.sender] = msg.value;
    }
    function get() public {
        // solium-disable-next-line
        if (!msg.sender.call.value(balances[msg.sender])()) {
            revert();
        }
        balances[msg.sender] = 0;
    }

    function() public {
        revert();
    }
}