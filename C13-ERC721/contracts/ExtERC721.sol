pragma solidity ^0.4.24;

import "./ERC721Burnable.sol";
import "./ERC721Full.sol";
import "./ERC721Mintable.sol";
import "./ERC721Pausable.sol";

contract ExtERC721 is ERC721Burnable, ERC721Full, ERC721Mintable, ERC721Pausable {
    constructor(string name, string symbol) ERC721Full(name, symbol)
        public
    {
    }
}