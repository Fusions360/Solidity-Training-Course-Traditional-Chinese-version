pragma solidity ^0.4.23;

import "./SafeMath.sol";

contract Membership {
    using SafeMath for uint256;

    // 用enum宣告列舉型別
    enum Class {Basic, VIP, VVIP}

    // 用struct宣告自定義結構
    struct Member {
        string name;
        uint256 point;
        Class class;
    }

    // 使用constant宣告固定常數
    // array, struct, mapping 不支援constant宣告
    uint256 constant public rate = 100;

    mapping(address => Member) public members;

    modifier nextClass() {
        _;
        if (members[msg.sender].point >= 1000) {
            if (uint256(members[msg.sender].class) != 2) {
                members[msg.sender].class = Class.VVIP;
            }
        } else if (members[msg.sender].point >= 500) {
            if (uint256(members[msg.sender].class) != 1) {
                members[msg.sender].class = Class.VIP;
            }            
        }
    }

    function register (
        string name
    )
        public
    {
        require(
            // string資料型別沒有length也無法用索引取得某個位置的字
            //   string s = 'something';
            //   s.length; // 編譯錯誤，沒有length
            //   s[0];     // 編譯錯誤，無法用索引取得某個位置的字
            //
            // 但實際上string與bytes資料型別相同，這兩者都是陣列array
            // string是動態長度的UTF-8資料陣列
            // bytes就是byte[]，bytes支援length以及索引取得某個位置的byte
            // 因型別相同，string可轉換為bytes，以間接支援length以及索引存取
            //   string s = 'something';
            //   bytes(s).length; // 取得s長度，回傳9
            //   bytes(s)[0];     // 用索引取得第一個以UTF-8編碼的byte，回傳's'
            //
            // 透過string與bytes轉換的技巧取得string長度，未初始化的string長度為0            
            bytes(members[msg.sender].name).length == 0 // 以本例來說，其實只需要檢查name
            && members[msg.sender].point == 0
            // enum列舉型別可轉換為uint，取得當前索引值
            // 未初始化的enum索引值為0
            && uint256(members[msg.sender].class) == 0,
            "已註冊過會員"
        );

        require(
            bytes(name).length > 0,
            "會員名稱為必填欄位"
        );

        // 初始化struct，並將其加入mapping
        // 另一種struct初始化寫法，差異點為參數順序必須正確:
        //   Member(name, 0, Class.Basic);
        members[msg.sender] = Member({
            class: Class.Basic,
            name: name,
            point: 0          
        });
    }

    function unregister() public {
        require(
            bytes(members[msg.sender].name).length > 0,
            "未註冊過會員"
        );

        // 用delete關鍵詞刪除區塊鏈上的儲存狀態
        // 以太坊將以退回Gas鼓勵開發者使用delete釋放區塊鏈上的儲存狀態
        // delete的對象可以是各個變數，但是無法delete整個mapping
        // mapping中的內容四散為區塊資料，因無法也沒有記住四散的區塊位置，所以無法刪除mapping
        // 但可以delete各別mapping內個別的元素
        // 若刪除的對象是struct，則struct內非mapping的成員也會被刪除
        delete members[msg.sender];
    }

    function shop(
        uint256 value
    )
        public
        nextClass
    {
        uint256 point = value.div(rate);
        members[msg.sender].point = members[msg.sender].point.add(point);
    }
}