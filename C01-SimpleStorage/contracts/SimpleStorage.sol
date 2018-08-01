/* 這是多行註解
 * 程式可執行於Solidity版本0.4.23以上，版本0.5之前(不含0.5)
 */
pragma solidity ^0.4.23;

// 這是單行註解
// 定義合約，合約名稱為SimpleStorage
contract SimpleStorage {
    
    // 宣告data為公開資料，編譯器將自動為public修飾的變數加上getter()，例如：data()
    // data為狀態變數(state variable)，其內容將存放於區塊鏈中合約的儲存區(storage)
    // data被宣告為uint256，其容許資料型態及範圍為正整數 0 到 2^256-1
    uint256 public data;

    /**
     * 這是Doxygen-style註解
     *
     * 儲存正整數資料
     *
     * @param x 欲儲存的資料
     */
    function set(uint256 x) public {
        // set() 被宣告為 public，所有合約可視範圍都可以存取set()
        //
        // 可視範圍相關的修飾詞包含如下：
        // public   可從合約內部和外部呼叫
        // external 無法從合約內部呼叫，只能從外部呼叫
        // internal 可從合約內部和衍生合約呼叫
        // private  僅可從當前合約內部呼叫
        //
        // 値得一提的是，呼叫相同功能的函數，相對於public，
        // 宣告為external會消耗較少的Gas。
        // 主要原因為宣告為public的函數會在被呼叫時將函數參數
        // 複製至記憶體 (如本例： uint256 x)，而記憶體空間宣告
        // 是較昂貴的；反之，宣告為external的函數會直接讀取函數參數。

        data = x;
    }

    /**
     * 讀取已儲存的正整數資料
     *
     * @return 已儲存的正整數資料
     */
    function get() public view returns (uint256) {
        // 除了public，get()被進一步以view修飾，其用以聲明
        // 這個函數將不會變更區塊鏈資料的狀態。
        //
        // 相關的另一個修飾詞為pure，其用以聲明這個函數
        // 將不會變更，也不會讀取區塊鏈資料狀態。
        //
        // 下述情況應視為讀取區塊鏈資料狀態：
        // 1. 讀取區塊鏈資料狀態
        // 2. 讀取餘額，如：this.balance或<address>.balance
        // 3. 讀取block、tx、msg的資料成員，但有例外：
        //    a. msg.data 完整呼叫資料 (calldata)
        //    b. msg.sig 呼叫資料的前4 bytes (函數識別値)
        // 4. 呼叫任何不是被pure修飾的函數
        // 5. 使用特定Solidity assembly操作碼

        return data;
    }
}