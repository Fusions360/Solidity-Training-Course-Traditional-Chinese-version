pragma solidity ^0.4.23;

import "./DetailedERC20.sol";
import "./MintableToken.sol";

contract MyToken is MintableToken, DetailedERC20 {
    constructor(
        string _name,
        string _symbol,
        uint8 _decimals
    )
        public
        // 初始化繼承的合約
        DetailedERC20(_name, _symbol, _decimals)
    {
        // EIP20 Specification (known as ERC20 Final Specification)
        // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md

        // We implement nothing here, and it is a EIP20 implementation.
        // Thanks to OpenZeppelin https://openzeppelin.org/
        // GitHub: https://github.com/OpenZeppelin/openzeppelin-solidity
    }
}

/*    
    contract A {
        uint public a;

        constructor(uint _a) internal {
            a = _a;
        }
    }

    // 另一種初始化繼承合約的方式
    contract B is A(1) {
        constructor() public {}
    }
 */