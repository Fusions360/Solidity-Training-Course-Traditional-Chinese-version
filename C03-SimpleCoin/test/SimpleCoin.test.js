const SimpleCoin = artifacts.require('SimpleCoin');
// 於測試案例中引用bignumber.js
const BigNumber = web3.BigNumber;

contract('測試SimpleCoin合約', async (accounts) => {

    let owner = accounts[0];
    let buyer1 = accounts[1];
    let buyer2 = accounts[2];

    let simpleCoin;
    
    beforeEach(async () => {
        simpleCoin = await SimpleCoin.new({from: owner});
    });

    it('應購買代幣', async function () {
        // buyer1用以太幣購買幣代
        let previousBalance = await web3.eth.getBalance(buyer1);
        let buyAmount = new BigNumber(10).pow(10);
        let receipt = 
            await simpleCoin.buyCoin({value: buyAmount, from: buyer1});
        let tx = await web3.eth.getTransaction(receipt.tx);

        // 驗證以太幣餘額
        let actualBalance = await web3.eth.getBalance(buyer1);
        let totalSpend = new BigNumber(receipt.receipt.gasUsed)
            .mul(tx.gasPrice).add(buyAmount);
        assert.equal(actualBalance.toString(), 
            previousBalance.minus(totalSpend).toString(), '以太幣餘額不符');

        // 驗證代幣餘額
        let actualCoinBalance = await simpleCoin.balances(buyer1);
        assert.equal(actualCoinBalance.toString(), 
            buyAmount.toString(), '代幣餘額不符');
    });

    it('應購買代幣且回退函數成本更高', async function () {        
        let previousBalance = await web3.eth.getBalance(buyer1);
        let buyAmount = new BigNumber(10).pow(10);
        // buyer1呼叫一般函數buyCoin()用以太幣購買幣代
        let receipt = await simpleCoin.buyCoin({value: buyAmount, from: buyer1});
        let gasUsedOfBuyCoin = new BigNumber(receipt.receipt.gasUsed);
        console.log('呼叫一般函數的Gas用量: %s', gasUsedOfBuyCoin.toString());

        // buyer1呼叫回退函數用以太幣購買幣代
        // 於測試案例中要呼叫回退函數請使用sendTransaction()
        receipt = await simpleCoin.sendTransaction({value: buyAmount, from: buyer1});
        let gasUsedOfFallbackFunction = new BigNumber(receipt.receipt.gasUsed);
        console.log('呼叫回退函數的Gas用量: %s', gasUsedOfFallbackFunction.toString());

        // 驗證兩次購買成本
        // !!! 注意: 這裡的成本使用一般函數還高於回退函數，與官方文件敘述不同，
        // 可能與測試環境實作方式有關，實際Gas耗用仍需以部署至真的以太坊的數值為準
        assert.isTrue(gasUsedOfBuyCoin.gt(gasUsedOfFallbackFunction),
            '與欲期購買成本不符');

        // 驗證代幣餘額
        let actualCoinBalance = await simpleCoin.balances(buyer1);
        assert.equal(actualCoinBalance.toString(), 
            buyAmount.mul(2).toString(), '代幣餘額不符');
    });

    it('應造幣給buyer1', async function () {
        let previousCoinBalance = await simpleCoin.balances(buyer1);
        let mintAmount = new BigNumber(10).pow(10);
        await simpleCoin.mintCoin(buyer1, mintAmount, {from: owner});
        let actualCoinBalance = await simpleCoin.balances(buyer1);
        assert.equal(actualCoinBalance.toString(), 
            previousCoinBalance.plus(mintAmount).toString(), 
            '代幣餘額不符');
    });

    it('應無法造幣給buyer1', async function () {
        let previousCoinBalance = await simpleCoin.balances(buyer1);
        let mintAmount = new BigNumber(10).pow(10);
        let thrown = false;
        try {
            await simpleCoin.mintCoin(buyer1, mintAmount, {from: buyer1});
        } catch (e) {
            thrown = true;
        }
        assert.isTrue(thrown);
        let actualCoinBalance = await simpleCoin.balances(buyer1);
        assert.equal(actualCoinBalance.toString(), 
            previousCoinBalance.toString(), '代幣餘額不符');
    });

    it('應燒毀buyer1的代幣', async function () {
        let previousCoinBalance = await simpleCoin.balances(buyer1);
        let mintAmount = new BigNumber(10).pow(10);
        await simpleCoin.mintCoin(buyer1, mintAmount, {from: owner});
        let burnAmount = new BigNumber(10).pow(9);
        await simpleCoin.burnCoin(buyer1, burnAmount, {from: owner});
        let actualCoinBalance = await simpleCoin.balances(buyer1);
        assert.equal(actualCoinBalance.toString(), 
            previousCoinBalance.plus(mintAmount).minus(burnAmount).toString(), 
            '代幣餘額不符'
        );
    });

    it('應轉出合約所有以太幣', async function(){
        // buyer1與buyer2先以以太幣購買代幣
        let buyAmount1 = new BigNumber(10).pow(10);
        await simpleCoin.buyCoin({value: buyAmount1, from: buyer1});
        let buyAmount2 = new BigNumber(10).pow(5);
        await simpleCoin.buyCoin({value: buyAmount2, from: buyer2});
        
        // 驗證合約以太幣餘額
        let previousContractBalance = await web3.eth.getBalance(simpleCoin.address);
        assert.equal(previousContractBalance.toString(), 
            buyAmount1.add(buyAmount2).toString(), '合約餘額不符');
        
        // owner轉出合約擁有的以太幣
        let previousBalance = await web3.eth.getBalance(owner);
        let receipt = await simpleCoin.withdraw({from: owner});
        let tx = await web3.eth.getTransaction(receipt.tx);
        
        // 驗證合約以太幣餘額
        let actualContractBalance = await web3.eth.getBalance(simpleCoin.address);
        assert.equal(actualContractBalance.toString(), '0', '合約以太幣餘額不符');

        // 驗證owner以太幣餘額
        let actualBalance = await web3.eth.getBalance(owner);
        let withdrawCost = new BigNumber(receipt.receipt.gasUsed).mul(tx.gasPrice);
        let withdrawAmount = buyAmount1.add(buyAmount2);
        assert.equal(actualBalance.toString(), 
            previousBalance.sub(withdrawCost).add(withdrawAmount).toString(), 
            'owner以太幣餘額不符');
    });
})