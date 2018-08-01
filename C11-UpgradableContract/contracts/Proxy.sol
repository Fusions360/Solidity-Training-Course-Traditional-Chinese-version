// Modified from
// https://medium.com/quillhash/how-to-write-upgradable-smart-contracts-in-solidity-d8f1b95a0e9a

pragma solidity ^0.4.23;

import "./Ownable.sol";
import "./StorageState.sol";

contract Proxy is StorageState, Ownable {
   
    constructor (KeyValueStorage storage_) public {
        _storage = storage_;
    }

    event Upgraded(address indexed implementation);

    address public _implementation;

    function implementation() public view returns (address) {
        return _implementation;
    }

    function upgradeTo(address impl) public onlyOwner {
        require(_implementation != impl);
        _implementation = impl;
        emit Upgraded(impl);
    }
 
    function () payable public {
        address _impl = implementation();
        require(_impl != address(0));
        bytes memory data = msg.data;

        // solium-disable-next-line
        assembly {
            // delegatecall 可於執行期間，動態載入位於另一個位址上的程式(code)
            // 儲存狀態、位址、餘額仍舊使用呼叫deletegatecall合約上的，
            // 僅程式邏輯是使用另一個位址上的程式

            // Solidity Assembly
            //   http://solidity.readthedocs.io/en/v0.4.24/assembly.html
            //
            // delegatecall(g, a, in, insize, out, outsize):
            //   以下列參數呼叫位於address a的合約:
            //     g 使用的gas量: 直接用指令gas取得用於呼叫函數的gas量
            //     in, insize 輸入參數資料: in 參數資料啟始位置, insize 參數資料長度
            //     out, outsize 輸出資料: out 輸出資料起始位置, outsize 輸出資料長度
            //   回傳結果:
            //     0 失敗
            //     1 成功

            // add(data, 0x20) 移動索引至data儲存位置起點
            //
            // 詳細說明 add(data, 0x20)
            //   https://ethereum.stackexchange.com/questions/34529/understanding-solidity-inline-assembly-code
            //
            // data:
            //   data在本例中表示data在記憶體中的起始位置
            //
            // add(x, y):
            //   加法, x + y
            //
            // 0x20:
            //   陣列的前32 bytes保留給陣列長度資訊(32 bytes = 0x20 bytes)

            // mload(data) 取得data長度

            let result := delegatecall(gas, _impl, add(data, 0x20), mload(data), 0, 0)
            
            // returndatasize:
            //   最後一個回傳資料的長度
            let size := returndatasize
            
            // 複製資料至0x40啟始的記憶體位置
            // 在Solidity中free memory從0x40位置開始
            // 將資料複製至0x40，並將其命名為ptr
            let ptr := mload(0x40)
                        
            // returndatacopy(t, f, s):
            //   將returndata中從f開始的s個bytes複製到記憶體t開始的位置
            returndatacopy(ptr, 0, size)

            // delegatecall
            //   returns 0 發生錯誤
            //   returns 1 呼叫成功
            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }
}