const KeyValueStorage = artifacts.require('KeyValueStorage');
const ProxyContract = artifacts.require('Proxy');
const HoneyPot = artifacts.require('HoneyPot');
const HoneyPotBestPractice = artifacts.require('HoneyPotBestPractice');
const HoneyPotCollect = artifacts.require('HoneyPotCollect');
const BigNumber = web3.BigNumber;

contract('測試攻擊可更新合約HoneyPot', async (accounts) => {

    let banker = accounts[0];
    let attacker = accounts[1];
    let depositor1 = accounts[2];
    let depositor2 = accounts[3];
    let depositor3 = accounts[4];

    // 回傳亂數: min (包含), max (包含)
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    it('應成功更新銀行合約', async function () {
        // 部署Storage
        let storage = await KeyValueStorage.new({from: banker});
        // 部署Proxy
        let proxy = await ProxyContract.new(storage.address, {from: banker});
        // 開銀行        
        let bankV1 = await HoneyPot.new({from: banker});

        // 將銀行實作設定給proxy合約
        await proxy.upgradeTo(bankV1.address);

        // 使用_.extend(destination, source1, source2, ..., sourceN)
        // 將HoneyPot的屬性(properties)複製至proxy
        //
        // at(): 在指定的地址，建立合約instance
        // https://github.com/trufflesuite/truffle-contract
        _.extend(proxy, HoneyPot.at(proxy.address));

        // 開戶存錢
        let valueInit = new BigNumber((10**18) * 10);
        await proxy.put({value: valueInit, from: banker});

        // 列印銀行餘額
        let bankBalance = await web3.eth.getBalance(proxy.address);
        console.log('銀行餘額:', bankBalance.toNumber());
        assert.equal(bankBalance.toNumber(), valueInit.toNumber(),
            '銀行餘額不一致');

        // 準備惡意軟件
        let malware = await HoneyPotCollect.new(proxy.address, {from: attacker});

        // 開始攻擊
        console.log('發起攻擊');
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
        bankBalance = await web3.eth.getBalance(proxy.address);
        console.log('銀行餘額:', bankBalance.toNumber());
        assert.equal(bankBalance.comparedTo(new BigNumber(10**18)), -1, 
            '銀行餘額應小於1以太幣');

        // 更新銀行合約       
        let bankV2 = await HoneyPotBestPractice.new({from: banker});
        await proxy.upgradeTo(bankV2.address);

        // 開戶存錢
        let value1 = new BigNumber((10**17) * getRndInteger(10, 100));
        await proxy.put({value: value1, from: depositor1});
        let value2 = new BigNumber((10**17) * getRndInteger(10, 100));
        await proxy.put({value: value2, from: depositor2});
        let value3 = new BigNumber((10**17) * getRndInteger(10, 100));
        await proxy.put({value: value3, from: depositor3});

        // 列印銀行餘額
        bankBalance = await web3.eth.getBalance(proxy.address);
        console.log('銀行餘額:', bankBalance.toNumber());
        assert.equal(bankBalance.toNumber(), value1.add(value2).add(value3).toNumber(),
            '銀行餘額不一致');

        // 再次開始攻擊
        console.log('再次發起攻擊');
        let thrown = false;
        try {
            await malware.collect({value: bucketSize, from: attacker});
        } catch (e) {
            thrown = true;
            console.log('攻擊失敗');
        }
        assert.isTrue(thrown, '應攻擊失敗');
    
        // 列印銀行餘額
        bankBalance = await web3.eth.getBalance(proxy.address);
        console.log('銀行餘額:', bankBalance.toNumber());
        assert.equal(bankBalance.toNumber(), value1.add(value2).add(value3).toNumber(),
            '銀行餘額不一致');
    });
})