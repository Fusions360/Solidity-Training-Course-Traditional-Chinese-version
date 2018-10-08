pragma solidity ^0.4.24;

import "./Roles.sol";


contract MerchantRole {
  using Roles for Roles.Role;

  event MerchantAdded(address indexed account);
  event MerchantRemoved(address indexed account);

  Roles.Role private merchants;

  constructor() public {
    merchants.add(msg.sender);
  }

  modifier onlyMerchant() {
    require(isMerchant(msg.sender));
    _;
  }

  function isMerchant(address account) public view returns (bool) {
    return merchants.has(account);
  }

  function addMerchant(address account) public onlyMerchant {
    merchants.add(account);
    emit MerchantAdded(account);
  }

  function renounceMerchant() public {
    merchants.remove(msg.sender);
  }

  function _removeMerchant(address account) internal {
    merchants.remove(account);
    emit MerchantRemoved(account);
  }
}
