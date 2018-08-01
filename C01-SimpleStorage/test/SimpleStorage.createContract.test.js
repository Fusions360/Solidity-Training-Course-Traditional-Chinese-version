// 注意: 所有的測試案例皆以非同步方式撰寫，非同步寫法較易維護且容易理解
// 同步測試寫法可參考 http://truffleframework.com/docs/getting_started/javascript-tests


// 指定於測試案例內參與互動的合約
const SimpleStorage = artifacts.require('SimpleStorage');

// 於contract()說明測試主題
// Truffle 測試套件，提供10個預設以太坊帳號供測試使用
// 例如：accounts[0], accounts[1], ..., accounts[9]
contract('測試SimpleStorage合約部署功能', async (accounts) => {

    before(async function () {
        // before()於所有測試前執行一次
        // 若不需要可省略
    });

    after(async function () {
        // after()於所有測試後執行一次
        // 若不需要可省略
    });
    
    beforeEach(async () => {
        // beforeEach()於每次測試前執行
        // 若不需要可省略
    });

    afterEach(async function () {
        // afterEach()於每次測試後執行
        // 若不需要可省略
    });

    it('應成功部署合約', async function () {
        // 於it()描述測試案例內容

        // 列印帳號位址
        console.log('使用者帳號位址: %s', accounts[0]);

        // 透過Ethereum JavaScript API (web3.js)取得帳號餘額(Wei)
        // 1 Ether = 1e+18 Wei
        let previousBalance = await web3.eth.getBalance(accounts[0]);
        console.log('建立合約前餘額: %d Wei', previousBalance);

        // 由帳號accounts[0]，以非同步方式部署SimpleStorage合約
        let simpleStorage = await SimpleStorage.new({from: accounts[0]});

        // 列印合約位址
        console.log('合約位址: %s', simpleStorage.address);
        
        // 使用assert提供的函數檢查測試結果
        // 了解更多預設支援的檢查 https://nodejs.org/api/assert.html
        assert.ok(simpleStorage, '合約變數未被定義');

        // 取得部署合約的收據
        let receiptOfCreateContract = await web3.eth.getTransactionReceipt(
            simpleStorage.transactionHash);
        // 列印部署合約的Gas用量
        console.log('建立合約的Gas使用量: %d', receiptOfCreateContract.gasUsed);

        // 取得建立合約的交易
        let txOfCreateContract = 
            await web3.eth.getTransaction(simpleStorage.transactionHash);
        // 列印部署合約時的Gas價格 (Wei)
        // Gas價格於測試期間應是保持一致的
        console.log('Gas價格: %d', txOfCreateContract.gasPrice);
        
        // 實際執行交易成本 (Wei) = gasUsed * pasPrice
        let cost = receiptOfCreateContract.gasUsed * txOfCreateContract.gasPrice;
        console.log('建立合約共花費: %d Wei', cost);

        let balance = await web3.eth.getBalance(accounts[0]);
        console.log('建立合約後餘額: %d Wei', balance);

        // 檢查部署合約前後，餘額是否一致
        // assert.equal(實際値, 預期値, '錯誤訊息');
        assert.equal(balance.toNumber() + cost, previousBalance.toNumber(), '餘額不一致');
    });

    it('應無法部署合約', async function () {
        let previousBalance = await web3.eth.getBalance(accounts[0]);
        console.log('建立合約前餘額: %d Wei', previousBalance);

        let simpleStorage;

        let thrown = false;
        try {
            let insufficientGas = 10;
            // 以不足的Gas部署合約
            simpleStorage = await SimpleStorage.new(
                {gas: insufficientGas, from: accounts[0]});
        } catch(e) {
            thrown = true;
        }        
        assert.isTrue(thrown, '應拋出例外');

        assert.ok(!simpleStorage, '合約變數不應被定義');

        let balance = await web3.eth.getBalance(accounts[0]);
        console.log('建立合約失敗後餘額: %d Wei', balance);

        // 檢查前後餘額是否一致
        // 注意: 只有測試環境檢查會通過，正常的區塊鏈不會將Gas退還，以避免DDoS攻擊!
        assert.equal(balance.toNumber(), previousBalance.toNumber(), '餘額不一致' );
    });
})