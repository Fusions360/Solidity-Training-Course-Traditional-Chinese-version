pragma solidity ^0.4.24;

import "./ERC20.sol";
import "./MerchantRole.sol";


/**
 * @title ERC20Payable
 * @dev ERC20 payment logic
 */
contract ERC20Payable is ERC20, MerchantRole {
    function pay(address _from, address _to, uint256 _value)
        external
        onlyMerchant
        returns (bool)
    {
        require(_value <= _balances[_from]);
        require(_to != address(0));

        _balances[_from] = _balances[_from].sub(_value);
        _balances[_to] = _balances[_to].add(_value);
        emit Transfer(_from, _to, _value);
        return true;
    }
}
