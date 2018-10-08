const HoneyPot = artifacts.require('HoneyPotCEI');
const HoneyPotCollect = artifacts.require('HoneyPotCollect');
const BigNumber = web3.BigNumber;

contract('測試攻擊合約HoneyPotCEI', async (accounts) => {

    let banker = accounts[0];
    let attacker = accounts[1];
    let depositor1 = accounts[2];
    let depositor2 = accounts[3];
    let depositor3 = accounts[4];

    // 回傳亂數: min (包含), max (包含)
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    it('應無法偷取銀行', async function () {
        // 開銀行
        let valueInit = new BigNumber(10).pow(18).times(10);
        let bank = await HoneyPot.new({value: valueInit, from: banker});

        // 開戶存錢
        let value1 = new BigNumber(10)
            .pow(17).times(new BigNumber(getRndInteger(10, 100)));
        await bank.put({value: value1, from: depositor1});
        let value2 = new BigNumber(10)
            .pow(17).times(new BigNumber(getRndInteger(10, 100)));
        await bank.put({value: value2, from: depositor2});
        let value3 = new BigNumber(10)
            .pow(17).times(new BigNumber(getRndInteger(10, 100)));
        await bank.put({value: value3, from: depositor3});
        
        // 準備惡意軟件
        let malware = await HoneyPotCollect.new(bank.address, {from: attacker});
        
        // 開始攻擊
        let bucketSize = new BigNumber(10).pow(18).times(10);
        console.log('每次偷取:', bucketSize.toString());
        let thrown = false;
        try {
            await malware.collect({value: bucketSize, from: attacker});
        } catch (e) {
            thrown = true;
        }
        assert.isTrue(thrown);

        let bankBalance = await web3.eth.getBalance(bank.address);
        console.log('銀行餘額:', bankBalance.toString());
        assert.equal(
            bankBalance.toString(), 
            valueInit.add(value1).add(value2).add(value3).toString(), 
            '銀行餘額不正確');
    });
})