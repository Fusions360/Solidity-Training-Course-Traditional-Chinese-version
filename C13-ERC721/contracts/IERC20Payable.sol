pragma solidity ^0.4.24;


interface IERC20Payable {
  function pay(address _from, address _to, uint256 _value) external returns (bool);
}
