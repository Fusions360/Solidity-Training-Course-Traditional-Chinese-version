const UseSafeMath = artifacts.require('UseSafeMath');
// 於測試案例中引用bignumber.js
const BigNumber = web3.BigNumber;

contract('測試UseSafeMath合約', async (accounts) => {

    let useSafeMath;
    
    beforeEach(async () => {
        useSafeMath = await UseSafeMath.new({from: accounts[0]});
    });

    it('應因加法溢位拋出例外', async function () {
        let previousValue = await useSafeMath.value();
        assert.equal(previousValue.toNumber(), 0, '數值不等於0');
        let value = new BigNumber(2).pow(256).minus(1);
        let thrown = false;
        try {
            // value = 2**256 - 1
            await useSafeMath.add(value, {from: accounts[0]});
        } catch (e) {
            thrown = true;
        }
        assert.isFalse(thrown, '不應拋出例外');
        previousValue = await useSafeMath.value();
        try {
            // overflow
            await useSafeMath.add(1, {from: accounts[0]});
        } catch (e) {
            thrown = true;
        }
        assert.isTrue(thrown, '應拋出例外');
        let actualValue = await useSafeMath.value();
        // 使用BigNumber.toString()來產生高精確度的數值結果
        assert.equal(actualValue.toString(), 
            previousValue.toString(), '數值應一致');
    });

    it('應因減法溢位拋出例外', async function () {
        let previousValue = await useSafeMath.value();
        assert.equal(previousValue.toString(), '0', '數值不等於0');
        let value = 100;
        let thrown = false;
        try {
            await useSafeMath.substract(value, {from: accounts[0]});
        } catch (e) {
            thrown = true;
        }
        assert.isTrue(thrown, '應拋出例外');
        let actualValue = await useSafeMath.value();
        assert.equal(actualValue.toString(), 
            previousValue.toString(), '數值應一致');
    });

    it('應因乘法溢位拋出例外', async function () {
        let previousValue = await useSafeMath.value();
        assert.equal(previousValue.toString(), '0', '數值不等於0');
        let value = new BigNumber(2).pow(255);
        await useSafeMath.add(value, {from: accounts[0]});
        previousValue = await useSafeMath.value();
        let multiplyValue = 2;
        let thrown = false;
        try {
            await useSafeMath.multiply(multiplyValue, {from: accounts[0]});
        } catch (e) {
            thrown = true;
        }
        assert.isTrue(thrown, '應拋出例外');
        let actualValue = await useSafeMath.value();
        assert.equal(actualValue.toString(), 
            previousValue.toString(), '數值應一致');
    });

    it('應因除法拋出例外', async function () {
        let previousValue = await useSafeMath.value();
        assert.equal(previousValue.toString(), '0', '數值不等於0');
        let value = 0;
        let thrown = false;
        try {
            await useSafeMath.divide(value, {from: accounts[0]});
        } catch (e) {
            thrown = true;
        }
        assert.isTrue(thrown, '應拋出例外');
        let actualValue = await useSafeMath.value();
        assert.equal(actualValue.toString(), 
            previousValue.toString(), '數值應一致');
    });
})