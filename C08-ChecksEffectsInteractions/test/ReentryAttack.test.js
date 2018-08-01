const HoneyPot = artifacts.require('HoneyPot');
const HoneyPotCollect = artifacts.require('HoneyPotCollect');
const BigNumber = web3.BigNumber;

contract('測試攻擊合約HoneyPot', async (accounts) => {

    let banker = accounts[0];
    let attacker = accounts[1];
    let depositor1 = accounts[2];
    let depositor2 = accounts[3];
    let depositor3 = accounts[4];

    // 回傳亂數: min (包含), max (包含)
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    it('應成功把銀行偷到少於1以太幣', async function () {
        // 開銀行
        let valueInit = new BigNumber((10**18) * 10);
        let bank = await HoneyPot.new({value: valueInit, from: banker});

        // 開戶存錢
        let value1 = new BigNumber((10**17) * getRndInteger(10, 100));
        await bank.put({value: value1, from: depositor1});
        let value2 = new BigNumber((10**17) * getRndInteger(10, 100));
        await bank.put({value: value2, from: depositor2});
        let value3 = new BigNumber((10**17) * getRndInteger(10, 100));
        await bank.put({value: value3, from: depositor3});

        // 準備惡意軟件
        let malware = await HoneyPotCollect.new(bank.address, {from: attacker});

        // 開始攻擊
        let bucketSize = new BigNumber((10**18));
        console.log('每次偷取:', bucketSize.toNumber());
        let receipt = await malware.collect({value: bucketSize, from: attacker});
        let tx = await web3.eth.getTransaction(receipt.tx);

        // 計算並列印攻擊成本
        let stealCost = new BigNumber(receipt.receipt.gasUsed).mul(tx.gasPrice);
        console.log('攻擊成本:', stealCost.toNumber());

        // 列印總偷取金額
        let stealAmount = await web3.eth.getBalance(malware.address);
        console.log('偷取金額:', stealAmount.toNumber());

        // 列印銀行餘額
        let bankBalance = await web3.eth.getBalance(bank.address);
        console.log('銀行餘額:', bankBalance.toNumber());
        assert.equal(bankBalance.comparedTo(new BigNumber(10**18)), -1, 
            '銀行餘額應小於1以太幣');

        // 收割不當獲利
        receipt = await malware.kill(attacker, {from: attacker});
        tx = await web3.eth.getTransaction(receipt.tx);

        // 計算並列印收割成本
        let killCost = new BigNumber(receipt.receipt.gasUsed).mul(tx.gasPrice);
        console.log('收割成本:', killCost.toNumber());

        // 列印最終獲利金額
        let attackerBalance = await web3.eth.getBalance(attacker);
        let baselineBalance = await web3.eth.getBalance(accounts[5]);
        console.log('最終獲利:', attackerBalance.sub(baselineBalance).toNumber());
    });
})