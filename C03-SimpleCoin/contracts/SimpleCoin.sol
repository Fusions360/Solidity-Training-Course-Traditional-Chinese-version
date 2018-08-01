pragma solidity ^0.4.23;

import "./Ownable.sol";
import "./SafeMath.sol";

// 使用is關鍵詞繼承其他合約
// 在本例中編譯器會將Ownable合約的內容複製到SimpleCoin合約中
contract SimpleCoin is Ownable {
    using SafeMath for uint256;

    // 類似Hash Map結構
    // Key: address (160-bit值，不允許算數運算)
    //      *  合約被部署後會有address
    //      ** 每個執行合約的使用者也都有address 
    // Value: uint256
    //
    // 使用 balances[address] 取得對應於該address的餘額uint256
    mapping(address => uint256) public balances;

    // 使用event關鍵詞來宣告事件
    // 事件被觸發後會寫入log
    //
    // CoinBought是事件名稱
    // 事件參數被宣告為indexed可用來篩選log
    // 一個事件最多只能有3個indexed參數
    event CoinBought(
        address indexed buyer,
        uint256 value
    );

    event CoinMinted(
        address indexed minter,
        address indexed to,
        uint256 value
    );

    event CoinBurned(
        address indexed burner,
        address indexed from,
        uint256 value
    );

    event Withdrawn(
        address indexed beneficiary,
        uint256 value
    );

    // 使用payable修飾詞修飾function，該function能接受以太幣轉入
    function buyCoin() public payable {
        // 使用emit關鍵詞觸發事件
        emit CoinBought(msg.sender, msg.value);

        // msg.sender: 取得function呼叫者的address
        // msg.value: 取核呼叫function時轉入的以太幣
        balances[msg.sender] = balances[msg.sender].add(msg.value);
    }

    // 回退函數(fallback function):
    // 每一個合約只能有一個沒有名稱且沒有回傳值的函數
    // 呼叫合約時，若沒有匹配上任何一個函數，就會預設呼叫回退函數
    // 若合約沒有定義回退函數，收到以太幣轉帳會拋出例外異常，並退回以太幣
    // 
    // 下述回退函數操作會比一般函數呼叫操作耗費更多Gas:
    // 1. 寫入資料至區塊，變更區塊儲存狀態
    // 2. 建立合約
    // 3. 呼叫外部函數(external function)
    // 4. 發送以太幣、以太幣轉帳
    //
    // 使用時機: 當你的合約需要透過直接轉帳接收以太幣時
    function() public payable {
        // 為了比較Gas消耗差異，包含與buyCoin()一樣的實作
        emit CoinBought(msg.sender, msg.value);
        balances[msg.sender] = balances[msg.sender].add(msg.value);
    }

    // onlyOwner為函數修改器(modifier)，繼承至Ownable.sol合約
    function mintCoin(address to, uint256 value) public onlyOwner {
        emit CoinMinted(msg.sender, to, value);
        balances[to] = balances[to].add(value);
    }

    
    function burnCoin(address from, uint256 value) public onlyOwner {
        emit CoinBurned(msg.sender, from, value);
        balances[from] = balances[from].sub(value);
    }

    function withdraw() public onlyOwner {
        emit Withdrawn(msg.sender, address(this).balance);

        // 使用 address.transfer(value) 轉 value (以太幣) 到 address
        // this代表這個合約本身，address(this)為這個合約的地址
        // address(this).balance為這個合約的以太幣餘額(Wei)
        msg.sender.transfer(address(this).balance);
    }
}