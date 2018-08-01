const Modifiers = artifacts.require('Modifiers');
// 於測試案例中引用bignumber.js
const BigNumber = web3.BigNumber;

contract('測試Modifiers合約', async (accounts) => {

    let modifiers;
    let defaultValue;
    
    beforeEach(async () => {
        defaultValue = 100;
        // 部署合約時帶入建構函數所需參數
        modifiers = await Modifiers.new(defaultValue, {from: accounts[0]});
    });

    it('應因執行加法數值太小拋出例外', async function () {
        let previousValue = await modifiers.value();
        assert.equal(previousValue.toNumber(), defaultValue, '數值不一致');
        let value = new BigNumber(10);
        let thrown = false;
        try {
            await modifiers.add(value, {from: accounts[0]});
        } catch (e) {
            thrown = true;
        }
        assert.isTrue(thrown, '應拋出例外');
        let actualValue = await modifiers.value();
        assert.equal(actualValue.toNumber(), 
            previousValue.toNumber(), '數值應一致');
    });

    it('應無法透過減法改變數值', async function () {
        let previousValue = await modifiers.value();
        assert.equal(previousValue.toNumber(), defaultValue, '數值不一致');
        let value = new BigNumber(10);
        await modifiers.substract(value, {from: accounts[0]});
        let actualValue = await modifiers.value();
        assert.equal(actualValue.toNumber(), 
            previousValue.toNumber(), '數值應一致');
    });

    it('應因乘行加法數值太小拋出例外', async function () {
        let previousValue = await modifiers.value();
        assert.equal(previousValue.toNumber(), defaultValue, '數值不一致');
        let value = new BigNumber(10);
        let thrown = false;
        try {
            await modifiers.multiply(value, {from: accounts[0]});
        } catch (e) {
            thrown = true;
        }
        assert.isTrue(thrown, '應拋出例外');
        let actualValue = await modifiers.value();
        assert.equal(actualValue.toNumber(), 
            previousValue.toNumber(), '數值應一致');
    });

    it('應無法透過乘法改變數值', async function () {
        let previousValue = await modifiers.value();
        assert.equal(previousValue.toNumber(), defaultValue, '數值不一致');
        let value = new BigNumber(100);
        await modifiers.multiply(value, {from: accounts[0]});
        let actualValue = await modifiers.value();
        assert.equal(actualValue.toNumber(), 
            previousValue.toNumber(), '數值應一致');
    });

    it('應永遠回傳0', async function () {
        let previousValue = await modifiers.value();
        assert.equal(previousValue.toNumber(), defaultValue, '數值不一致');
        let value = new BigNumber(10);
        let returnedValue = await modifiers.divide.call(value, {from: accounts[0]});
        assert.equal(returnedValue.toNumber(), 0, '回傳值應為0');
        let actualValue = await modifiers.value();
        assert.equal(actualValue.toNumber(), 
            previousValue.toNumber(), '數值應一致');
    });
})