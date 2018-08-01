pragma solidity ^0.4.23;

import "./SafeMath.sol";

contract UseSafeMath {
    // 指示附加並套用函數庫Library內的函數至指定資料形態
    // 例如：指示附加並套用SafeMath函數庫內的函數至uint256
    using SafeMath for uint256;

    uint256 public value;

    function add(uint256 v) public {
        // value.add(v) 會傳入兩個參數給add(uint256 a, uint256 b)
        // 在函數庫的情境下，value也會將自己傳入，作為第一個參數
        // 在本例中 a = value, b = v        
        value = value.add(v);
    }

    function substract(uint256 v) public {
        value = value.sub(v);
    }

    function multiply(uint256 v) public {
        value = value.mul(v);
    }

    function divide(uint256 v) public {
        value = value.div(v);
    }
}