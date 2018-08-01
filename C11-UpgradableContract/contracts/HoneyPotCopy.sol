pragma solidity ^0.4.23;

// 抽象合約 (abstract contract) 為 '包含至少一個函數未被實作' 的合約

// 介面 (interface) 與抽象合約類似，但有更多限制
// 1. 無法繼承其他合約或介面
// 2. 不能有建構函數 constructor
// 3. 不能定義變數 variable
// 4. 不能定義自定義結構 struct
// 5. 不能定義列舉型別 enum

contract HoneyPotCopy {
    // 沒有被實作的函數
    function put() payable public;
    function get() public;
    function() public;
}