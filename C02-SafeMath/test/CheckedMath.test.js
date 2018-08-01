const CheckedMath = artifacts.require('CheckedMath');

contract('測試CheckedMath合約', async (accounts) => {

    let checkedMath;
    
    beforeEach(async () => {
        checkedMath = await CheckedMath.new({from: accounts[0]});
    });

    it('應因加法溢位拋出例外', async function () {
        let previousValue = await checkedMath.value();
        assert.equal(previousValue, 0, '數值不等於0');
        let value = 2**8 - 1;
        let thrown = false;
        try {
            // value = 2**8 - 1
            await checkedMath.add(value, {from: accounts[0]});
            // overflow
            await checkedMath.add(1, {from: accounts[0]});
        } catch (e) {
            thrown = true;
        }
        assert.isTrue(thrown, '應拋出例外');
    });

    it('應加法溢位但不拋出例外', async function () {
        let previousValue;
        let actualValue;
        
        let thrown = false;
        try {
            // 加255
            await checkedMath.add(2**8 - 1, {from: accounts[0]});
            previousValue = await checkedMath.value();
            // 參數溢位 value = 0
            let value = 2**8;
            await checkedMath.add(value, {from: accounts[0]});
            actualValue = await checkedMath.value();
        } catch (e) {
            thrown = true;
        }
        assert.isFalse(thrown, '不應拋出例外');
        assert.equal(actualValue.toNumber(), 
            previousValue.toNumber(), '數值不一致');
    });

    it('應因減法溢位拋出例外', async function () {
        let previousValue = await checkedMath.value();
        assert.equal(previousValue, 0, '數值不等於0');
        let value = 100;
        let thrown = false;
        try {
            await checkedMath.substract(value, {from: accounts[0]});
        } catch (e) {
            thrown = true;
        }
        assert.isTrue(thrown, '應拋出例外');
    });

    it('應因乘法溢位拋出例外', async function () {
        let previousValue = await checkedMath.value();
        assert.equal(previousValue, 0, '數值不等於0');
        let value = 100;
        await checkedMath.add(value, {from: accounts[0]});
        let multiplyValue = 3;
        let thrown = false;
        try {
            await checkedMath.multiply(multiplyValue, {from: accounts[0]});
        } catch (e) {
            thrown = true;
        }
        assert.isTrue(thrown, '應拋出例外');
    });
})