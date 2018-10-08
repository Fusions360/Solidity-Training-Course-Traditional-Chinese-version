# Ethereum smart contract programming training course (Traditional Chinese version)

With this training course, you will know how to write Ethereum smart contract by Solidity and corresponding unit test cases (JS with Truffle).

## Install development environment.

1. Install NodeJS 5.0+
`https://nodejs.org/en/download/`
2. Install Truffle by NodeJS
`https://truffleframework.com/docs/getting_started/installation`
Or just run `npm install -g truffle`
3. Install vscode (optional)
`https://code.visualstudio.com/Docs/setup/setup-overview`
4. Install vscode entensions: solidity (author: Juan Blanco) (optional)

### RUN TESTS: Use C01-SimpleStorage as example.
- Firstly, switch to the folder
`cd C01-SimpleStorage`
- Run specific test case
`truffle test ./test/SimpleStorage.test.js`
- Run all test case
`truffle test`

```sh
cd C01-SimpleStorage
truffle test ./test/SimpleStorage.test.js`
truffle test
```

## 課程大綱

透過深入淺出的範例學會可滿足職場95%以上需求的Solidity智能合約開發技術。

建議使用本課程大綱做為智能合約開發時的快速查表索引，帶領您找到可直接複製、貼上、修改的實用範例。

1. C00-Setup
    - Solidity開發環境設定
        - NodeJS
        - Truffle
        - vscode
2. C01-SimpleStorage
    - pragma 關鍵字
    - contract 關鍵字
    - 宣告整數資料形態
    - 函數
    - 函數可視範圍修飾詞
    - 智能合約非同步自動測試案例
        - 測試案例結構
        - 基本概念（預設測試帳號、合約/帳號地址、列印日誌）
        - 常用函數（合約部署、帳號餘額、交易成本、驗證檢查）
        - 例外處理
3. C02-SafeMath
    - 整數資料形態說明
    - require, revert, assert 檢查條件
    - 介紹 Library 寫法及如何使用
    - 使用 SafeMath Library
    - 於測試案例使用 bignumber.js
4. C03-SimpleCoin
    - 簡單代幣結構
    - 使用is關鍵詞繼承其他合約
    - 介紹 mapping 資料形態，來儲存字典類型資料
    - 介紹 event 事件及 emit 關鍵詞記錄日誌
    - 介紹 payable 關鍵詞使函數可接收以太幣
    - 介紹 fallback function 回退函數
    - 介紹 modifier 函數修改器
    - 於智能合約執行轉帳 address.transfer(value)
    - 於單元測試驗證餘額
5. C04-Modifiers
    - modifier 函數修改器教學與各種實例
    - 函數預設返回值與函數修改器拋出例外說明
6. C05-Membership
    - 介紹 enum 列舉型別
    - 介紹 struct 自定義結構及使用方式
    - 介紹 array 陣列資料結構
    - 介紹 string 與 bytes 字串資料形態
    - 說明 string 與 byte array 間的關係和轉換
    - 使用 constant 宣告固定常數
    - 使用 delete 關鍵詞刪除區塊鏈上的儲存狀態
7. C06-Arrays
    - Array 陣列操作
    - for和 while 迴圈控制
    - if 與邏輯控制
8. C07-Withdraw
    - 透過誰是以太王遊戲介紹 Withdraw 跨合約互動最佳實踐模式
    - 介紹以太坊時間單位及運算
    - 介紹以太坊或幣單位及運算
    - 合約函數多載 overloading
    - 使用 `// solium-disable-next-line` 避免編譯器警告
9. C08-ChecksEffectsInteractions
    - 透過攻擊智能合約偷取以太幣學習 Checks, Effects, and Interactions 的最佳實踐模式
    - 合約函數複寫 overriding
    - 介面 interface 與抽象合約 abstract contract
    - 介紹 ABI (Application Binary Interface)
    - 介紹 selfdestruct 函數
    - 於測試案例產生亂數
10. C09-ERC20
    - 介紹 [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-solidity)
    - 介紹 ERC20 代幣合約 (使用 OpenZepplin 的ERC20合約)
11. C10-Crowdsale
    - 介紹代幣眾籌 (使用 OpenZepplin 的 Crowdsale 合約)
12. C11-UpgradableContract
    - 撰寫可軟體升級、更新的智能合約
    - 透過 delegatecall 使用另一份智能合約程式
    - 撰寫可升級智能合約必要的 Solidity Assembly 精簡說明
    - 代理合約 Proxy Contract
    - 儲存合約 Storage Contract
13. C12-ECRecover
    - 使用ECRecover驗證使用者簽署
14. C12-ERC721
    - 介紹 ERC721 代幣合約 (使用 OpenZepplin 的ERC721合約)
    - 整合ERC20實作ERC721特店消費情境
