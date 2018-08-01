const SimpleStorage = artifacts.require('SimpleStorage');

contract('測試SimpleStorage合約', async (accounts) => {

    let simpleStorate;
    
    beforeEach(async () => {
        // 部署SimpleStorage合約
        simpleStorage = await SimpleStorage.new({from: accounts[0]});
    });

    it('應成功設定資料', async function () {
        // 記錄交易前餘額
        let previousBalance = await web3.eth.getBalance(accounts[0]);
        
        // 使用由編譯器自動產生的getter()取得data的內容
        // 應取得uint256預設値0
        let actualValue = await simpleStorage.data();
        assert.equal(actualValue, 0, '數值不等於0');

        // 由帳號accounts[0]，以非同步執行set()，並取回交易執行收據
        let value = 100;
        let receipt = await simpleStorage.set(value, {from: accounts[0]});
        let tx = await web3.eth.getTransaction(receipt.tx);

        // 驗證結果
        actualValue = await simpleStorage.data();
        assert.equal(actualValue, value, '數值不一致');

        // 驗證餘額
        let balance = await web3.eth.getBalance(accounts[0]);
        assert.equal(balance.toNumber() + receipt.receipt.gasUsed * tx.gasPrice, 
            previousBalance.toNumber(), '餘額不一致' );
    });

    it('應成功讀取資料', async function () {
        let actualValue = await simpleStorage.get();
        assert.equal(actualValue, 0, '數值不等於0');
        let value = 100;
        // 預設帳號也能指派給變數，提高可讀性
        let setter = accounts[0];
        await simpleStorage.set(value, {from: setter});
        actualValue = await simpleStorage.get();
        assert.equal(actualValue, value, '數值不一致');
    });

    it('應無法設定資料', async function () {
        let value = 100;
        let thrown = false;
        try {
            await simpleStorage.set(value, {from: setter});
        } catch(e) {
            thrown = true;
        }
        assert.isTrue(thrown, '應拋出例外');

        let actualValue = await simpleStorage.get();
        assert.notEqual(actualValue, value, '數值不應一致');
    });
})