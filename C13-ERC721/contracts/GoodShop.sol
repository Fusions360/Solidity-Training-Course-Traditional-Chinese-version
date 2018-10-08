pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./IERC20Full.sol";
import "./ExtERC721.sol";
import "./SignerRole.sol";


contract GoodShop is SignerRole {
    using SafeMath for uint256;

    address public tokenWallet;
    address public etherWallet;

    IERC20Full public token;
    ExtERC721 public goods;

    uint256 public goodIdCursor = 0;
    uint256 public tokenPrice = 0;
    uint256 public weiPrice = 0;

    modifier nonZeroAddress(address _addr) {
        require(
            _addr != address(0),
            "Failed to call function due to address is 0x0."
        );
        _;
    }

    constructor(
        address _goods, 
        address _token, 
        address _tokenWallet, 
        address _etherWallet, 
        uint256 _tokenPrice,
        uint256 _weiPrice
    ) 
        public
        nonZeroAddress(_goods)
        nonZeroAddress(_token)
        nonZeroAddress(_tokenWallet)
        nonZeroAddress(_etherWallet)
    {
        goods = ExtERC721(_goods);
        token = IERC20Full(_token);
        tokenWallet = _tokenWallet;
        etherWallet = _etherWallet;
        tokenPrice = _tokenPrice;
        weiPrice = _weiPrice;
    }

    function setERC721(address _goods) 
        external 
        onlySigner 
        nonZeroAddress(_goods)
    {
        goods = ExtERC721(_goods);
    }

    function setERC20(address _token) 
        external 
        onlySigner 
        nonZeroAddress(_token)
    {
        token = IERC20Full(_token);
    }

    function setTokenWallet(address _tokenWallet) 
        external 
        onlySigner 
        nonZeroAddress(_tokenWallet)
    {
        tokenWallet = _tokenWallet;
    }

    function setEtherWallet(address _etherWallet) 
        external 
        onlySigner 
        nonZeroAddress(_etherWallet)
    {
        etherWallet = _etherWallet;
    }

    function setTokenPrice(uint256 _tokenPrice) external onlySigner {
        tokenPrice = _tokenPrice;
    }

    function setWeiPrice(uint256 _weiPrice) external onlySigner {
        weiPrice = _weiPrice;
    }

    function _createGood(address _to) private {
        require(
            goods.mint(_to, goodIdCursor),
            "Failed to create good due to mint was failed."
        );
        // Move cursor to next.
        goodIdCursor = goodIdCursor.add(1);
    }

    function buyGoodWithToken() external {
        require(
            token.pay(msg.sender, tokenWallet, tokenPrice),
            "Failed to buy good due to payment was failed."
        );
        _createGood(msg.sender);
    }

    function _buyGoodWithEther() private {
        require(
            msg.value >= weiPrice,
            "Failed to buy good due to insufficient ETH."
        );
        _createGood(msg.sender);
        // Transfer ether immediately.
        etherWallet.transfer(address(this).balance);
    }

    function() external payable {        
        _buyGoodWithEther();
    }
}