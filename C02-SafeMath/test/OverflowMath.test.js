const OverflowMath = artifacts.require('OverflowMath');

contract('測試OverflowMath合約', async (accounts) => {

    let overflowMath;
    
    beforeEach(async () => {
        overflowMath = await OverflowMath.new({from: accounts[0]});
    });

    it('應成功執行加法', async function () {
        let previousValue = await overflowMath.value();
        assert.equal(previousValue, 0, '數值不等於0');
        let value = 100;
        await overflowMath.add(value, {from: accounts[0]});
        let actualValue = await overflowMath.value();
        assert.equal(actualValue.toNumber(), previousValue + value, '數值不一致');
    });

    it('應因執行加法溢位', async function () {
        let previousValue = await overflowMath.value();
        assert.equal(previousValue, 0, '數值不等於0');
        let value = 2**8;
        await overflowMath.add(value, {from: accounts[0]});
        actualValue = await overflowMath.value();
        assert.notEqual(actualValue, previousValue + value, '數值不應一致');
        actualValue = await overflowMath.value();
        assert.equal(actualValue.toNumber(), 0, '數值應為零');
    });

    it('應因執行減法溢位', async function () {
        let previousValue = await overflowMath.value();
        assert.equal(previousValue, 0, '數值不等於0');
        let value = 100;
        await overflowMath.substract(value, {from: accounts[0]});
        actualValue = await overflowMath.value();
        assert.equal(actualValue.toNumber(), 2**8 - value, '數值不一致');
    });

    it('應因執行乘法溢位', async function () {
        let previousValue = await overflowMath.value();
        assert.equal(previousValue, 0, '數值不等於0');
        let value = 100;
        await overflowMath.add(value, {from: accounts[0]});
        let multiplyValue = 3;
        await overflowMath.multiply(multiplyValue, {from: accounts[0]});
        actualValue = await overflowMath.value();
        assert.equal(actualValue.toNumber(), 
            Math.abs(2**8 - value*multiplyValue), '數值不一致');
    });

    it('應因執行除法拋出例外', async function () {
        let previousValue = await overflowMath.value();
        assert.equal(previousValue, 0, '數值不等於0');
        let value = 0;
        let thrown = false;
        try {
            await overflowMath.divide(value, {from: accounts[0]});
        } catch (e) {
            thrown = true;
        }
        assert.isTrue(thrown, '應拋出例外');
    });
})