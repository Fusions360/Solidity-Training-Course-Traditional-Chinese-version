pragma solidity ^0.4.23;

contract CheckedMath {
   
    uint8 public value;

    function add(uint8 v) public {
        // 使用require檢查條件
        // 條件不滿足會造成交易失敗，並退回未用完的Gas
        // 錯誤訊息可省略，如: require(value + v >= value);
        require(value + v >= value, "發生溢位");
        value = value + v;
    }

    function substract(uint8 v) public {
        if (v > value) {
            // revert會直接造成交易失敗，，並退回未用完的Gas
            // 與require的差異為，revert不帶檢查條件
            revert("發生溢位");
        }
        value -= v;
    }

    function multiply(uint8 v) public {
        value = value * v;
        // 使用assert檢查條件
        // 條件不滿足會造成交易失敗，所有未用完的Gas會被沒收
        // assert不能帶錯誤訊息
        assert(value / value == v);
    }

    function divide(uint8 v) public {
        // v = 0, Solidiy會自動拋出例外
        value = value / v;
    }

    // require和assert的使用時機並沒有硬性規定
    // 一般建議如下：
    // 1. assert用於較嚴重或昂貴的錯誤，
    //    例如：溢位、存取很長的陣列
    // 2. require提供較好的可讀性，也會退回未用的Gas，
    //    大多數狀況下應盡可能使用require

    // 以下為官方羅列會自動產生assert的例子:
    // 1. 存取很長的陣列索引x[i], i > x.length
    //    或負的陣列索引x[i], i < 0
    // 2. 以很大或負值索引存取固定長度bytesN
    // 3. 除以零 n / 0 或 取零的餘數 n % 0
    // 4. 數值操作的平移量(shift)為負值 << -1 或 >> -1
    // 5. 轉換大整數或負值成為列舉型別(enum)
    // 6. 呼叫internal修飾且未被初使化的函數
    //    參考 https://ethereum.stackexchange.com/questions/47009/call-a-zero-initialized-variable-of-internal-function-type
    // 7. 呼叫assert，且檢查條件評估結果為false

    // 以下官方羅列會自動產生require的例子:
    // 1. 呼叫throw
    // 2. 呼叫require，且檢查條件評估結果為false
    // 3. 利用call、send、delegatecall、callcode呼叫函數但沒有正確完成
    //    例如: Gas不足、沒有對應的函數、過程中拋出例外
    // 4. 於合約中使用new建立新合約，但新合約的建立沒有正確完成
    //    例如: Gas不足、沒有對應的合約、過程中拋出例外
    // 5. 呼叫外部合約函數，但目標合約沒有內容
    // 6. 合約中沒有payable修飾的函數接收到以太幣傳入
    // 7. 合約中的public getter()接收到以太幣傳入
    // 8. 透過 .transfer() 執行轉帳失敗
}