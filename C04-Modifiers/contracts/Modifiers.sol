pragma solidity ^0.4.23;

import "./SafeMath.sol";

contract Modifiers {
    using SafeMath for uint256;

    // 帶參數的函數修改器
    modifier minValue(uint256 min, uint256 v) {
        require(
            v >= min,
            "不滿足最小值要求"
        );
        _;
    }

    // 函數執行前後都執行程式的修改器
    modifier resetValue() {
        uint256 previous = value;
        _;
        value = previous;
    }

    // 跳過函數內容的修改器
    modifier skipOps() {
        if(false) {
            _;
        }
    }

    uint256 public value;

    // 使用constructor宣告合約建構函數
    // 合約部署時會優先執行
    constructor(uint256 initValue) public {
        value = initValue;
    }

    function add(
        uint256 v
    )
        public
        // 使用帶參數的合約修改器
        minValue(100, v)
    {      
        value = value.add(v);
    }

    function substract(
        uint256 v
    )
        public
        // 使用不帶參數的合約修改器
        resetValue
    {
        value = value.sub(v);
    }

    function multiply(
        uint256 v
    )
        public
        // 多個函數修改器可以混合使用
        minValue(100, v)
        resetValue
    {
        value = value.mul(v);
    }

    function divide(
        uint256 v
    )
        public
        skipOps
        returns(uint256)
    {
        value = value.div(v);
        // 當函數有返回值，且因函數修改器造成函數內容本體不執行時(非拋出例外錯誤)
        // 函數將回傳 '返回值型態的預設值'
        // 例如：
        //  bool      returns false
        //  int       returns 0
        //  uint      returns 0
        //  string    returns ""
        //  enum      returns 列舉型別中的第一個元素
        //  address   returns 0x0
        //  mapping   returns 空的 mapping
        //  struct    returns struct 其所有成員都設為預設值
        //  array
        //   *固定長度 returns array 其所有成員都設為預設值
        //   *動態長度 returns []
        return uint256(1);
    }
}