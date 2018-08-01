// The Withdraw pattern was originally inspired by King of the Ether.
// https://www.kingoftheether.com/thrones/kingoftheether/index.html

// Example was modified from:
// https://solidity.readthedocs.io/en/develop/common-patterns.html#withdrawal-pattern

pragma solidity ^0.4.23;

import "./SafeMath.sol";

contract Withdraw {
    using SafeMath for uint256;

    address public richest;
    uint256 public mostSent;
    uint256 public startAt;


    mapping (address => uint) public pendingWithdrawals;

    constructor(uint256 start) public payable {
        richest = msg.sender;
        mostSent = msg.value;
        startAt = start;
    }

    function stop() public {
        // 以太坊時間是以 unix time (seconds) 表示，並以uint256儲存
        // 注意: 非一般 milliseconds
        // 支援的時間單位:
        //   1 == 1 seconds
        //   1 minutes == 60 seconds
        //   1 hours == 60 minutes
        //   1 days == 24 hours
        //   1 weeks == 7 days
        //   1 years == 365 days

        require(
            // 使用 '// solium-disable-next-line' 避免編譯器警告
            // solium-disable-next-line security/no-block-members
            now >= (startAt + 30 days),
            "每次以太王活動必須至少舉行30天"
        );

        require(
            msg.sender == richest,
            "只有以太王能結束活動"
        );

        // 以太王收割韭菜
        msg.sender.transfer(address(this).balance);
    }

    // 多載 (overloading)
    function stop(address beneficiary) public {
        require(
            beneficiary != address(0),
            "帳號不得為0x0"
        );

        require(
            // 使用 '// solium-disable-next-line' 避免編譯器警告
            // solium-disable-next-line security/no-block-members
            now >= (startAt + 30 days),
            "每次以太王活動必須至少舉行30天"
        );

        require(
            msg.sender == richest,
            "只有以太王能結束活動"
        );

        // 以太王收割韭菜
        beneficiary.transfer(address(this).balance);
    }

    function becomeRichest() public payable returns (bool) {
        // wei 是以太坊最小貨幣單位，合約中大多透過wei作為貨幣計算單位
        // 以太坊貨幣單位: wei, szabo, finney, ether (皆可在合約內直接使用)
        // 1 ether = 1e+18 wei
        // 1 ether = 1e+6 szabo
        // 1 ether = 1000 finney

        // 每次最少增加 1 ether
        if (msg.value.sub(mostSent) >= 1 ether) {
            pendingWithdrawals[richest] = (
                pendingWithdrawals[richest].add(msg.value)
            );
            richest = msg.sender;
            mostSent = msg.value;
            return true;
        } else {
            return false;
        }
    }

    function withdraw() public {
        uint amount = pendingWithdrawals[msg.sender];
        // Remember to zero the pending refund before
        // sending to prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
}