pragma solidity ^0.4.23;

contract KeyValueStorage {

    mapping(address => mapping(bytes32 => mapping(address => uint256))) public _mapStorage;

    function getMap(bytes32 key, address mapKey) public view returns (uint256) {
        return _mapStorage[msg.sender][key][mapKey];
    }

    function setMap(bytes32 key, address mapKey, uint256 value) public {
        _mapStorage[msg.sender][key][mapKey] = value;
    }

    function deleteMap(bytes32 key, address mapKey) public {
        delete _mapStorage[msg.sender][key][mapKey];
    }
}