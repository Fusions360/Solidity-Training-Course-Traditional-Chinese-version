pragma solidity ^0.4.23;

import "./StorageState.sol";

contract HoneyPot is StorageState {
    constructor() payable public {
        // 在可更新合約的實作中，建構函數不能操作state
    }
    function put() payable public {
        _storage.setMap("balances", msg.sender, msg.value);
    }
    function get() public {
        // solium-disable-next-line
        if (!msg.sender.call.value(_storage.getMap("balances", msg.sender))()) {
            revert();
        }
        _storage.setMap("balances", msg.sender, 0);
    }

    function() public {
        revert();
    }
}