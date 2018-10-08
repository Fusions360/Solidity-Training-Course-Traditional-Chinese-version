
pragma solidity ^0.4.24;

import "./ERC20.sol";
import "./ERC20Detailed.sol";
import "./ERC20Mintable.sol";
import "./ERC20Payable.sol";


contract ERC20Full is ERC20, ERC20Detailed, ERC20Mintable, ERC20Payable {
  constructor(
    string name, 
    string symbol, 
    uint8 decimals
  ) 
    ERC20Detailed(name, symbol, decimals)
    public
  {
  }
}
