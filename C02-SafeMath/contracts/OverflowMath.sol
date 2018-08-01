pragma solidity ^0.4.23;

contract OverflowMath {    
    
    // Solidity沒有浮點數，以下是支援的整數資料形態：帶正負號整數、無正負號正整數
    // 共通特性:
    // 1. 其長度以8位元增加，最短8位元，最長256位元
    // 2. 運算時超出容許範圍會造成溢位 (overflow)
    // 3. 宣告長度較短的資料形態理論上會比較節省Gas，但實務上不一定:
    //    a. 部分運算會強制將較短的資料形態轉型成特定長度資料形態，轉型也耗費Gas，
    //       在這種狀況下，較短的資料形態有可能消耗更多Gas
    //    b. 目前所有的代幣餘額 (token balance) 都是以uint256表示，所以絕大多數
    //       狀況下，相關的運算也都必須以uint256進行。
    //       在這種狀況下，使用較短的資料形態與uint256進行運算，依情況可能產生幾種結果:
    //       i.  產生額外轉型但結果正確，例: uint8 to uint256
    //       ii. 產生額外轉型且溢位，結果錯誤，例: uint256 to uint8
    //
    // 帶正負號整數: int8, int16, int24, ..., int240, int248, int256
    // int8: -(2^4) to 2^4-1
    // int256: -(2^128) to 2^128-1
    // int是int256的別名
    //
    // 無正負號正整數: uint8, uint16, uint24,, ..., uint240, uint248, uint256
    // uint8: 0 to 2^8-1
    // uint256: 0 to 2^256-1
    // uint是uint256的別名
    
    uint8 public value;

    function add(uint8 v) public {
        // 等效 value += v; 
        value = value + v;
    }

    function substract(uint8 v) public {
        value -= v;
    }

    function multiply(uint8 v) public {
        value *= v;
    }

    function divide(uint8 v) public {
        value /= v;
    }
}