const Withdraw = artifacts.require('Withdraw');
const BigNumber = web3.BigNumber;

contract('測試Withdraw合約', async (accounts) => {

    const ether = new BigNumber(10).pow(18);
    let richer1 = accounts[0];
    let richer2 = accounts[1];
    let richer3 = accounts[2];
    let secretWallet = accounts[3];

    it('應完成誰是以太王遊戲，且最後richer1為以太王', async function () {
        // 以太坊時間是以 unix time (seconds) 表示
        // 注意: 非一般 milliseconds
        let startAt = new Date('2018-01-01').getTime() / 1000;
        // console.log(startAt);
        let valueInit = new BigNumber(ether);

        // 記錄richer1先前餘額
        let previousBalanceRicher1 = await web3.eth.getBalance(richer1);

        // richer1 是部署合約的人，也是第一任以太王
        let instance = await Withdraw.new(
            startAt, {value: valueInit, from: richer1});
        
        // 驗證活動開始日期
        let actualStartAt = await instance.startAt.call();
        assert.equal(actualStartAt, startAt, '活動開始日期錯誤');

        // 驗證最大以太幣提交數量
        let actualMostSent = await instance.mostSent.call();
        assert.equal(actualMostSent.toString(), valueInit.toString(),
            '最大以太幣提交數量錯誤');

        // 驗證以太王
        let actualRichest = await instance.richest.call();
        assert.equal(actualRichest, richer1, 'richer1應為以太王');

        // 驗證參賽者可領取餘額
        let pendingWithdrawalOfRicher1 = await instance.pendingWithdrawals.call(richer1);
        assert.equal(pendingWithdrawalOfRicher1.toString(), '0', 'richer1可領取餘額錯誤');
        let pendingWithdrawalRicher2 = await instance.pendingWithdrawals.call(richer2);
        assert.equal(pendingWithdrawalRicher2.toString(), '0', 'richer2可領取餘額錯誤');
        let pendingWithdrawalRicher3 = await instance.pendingWithdrawals.call(richer3);
        assert.equal(pendingWithdrawalRicher3.toString(), '0', 'richer3可領取餘額錯誤');
        
        // 計算部署合約成本
        let receiptOfCreateContract = await web3.eth.getTransactionReceipt(
            instance.transactionHash);
        let txOfCreateContract = 
            await web3.eth.getTransaction(instance.transactionHash);
        let cost = new BigNumber(receiptOfCreateContract.gasUsed)
            .mul(txOfCreateContract.gasPrice);

        // 驗證richer1餘額
        let balanceRicher1 = await web3.eth.getBalance(richer1);
        assert.equal(
            balanceRicher1.toString(), 
            previousBalanceRicher1.minus(cost).minus(valueInit).toString(),
            'richer1餘額不一致'
        );
        
        // 記錄richer2先前餘額
        let previousBalanceRicher2 = await web3.eth.getBalance(richer2);

        let value2 = new BigNumber(ether).times(2);
        // richer2 競爭成為第二任以太王
        let receipt = await instance.becomeRichest(
            {value: value2, from: richer2}
        );
        let tx = await web3.eth.getTransaction(receipt.tx);

        // 驗證最大以太幣提交數量
        actualMostSent = await instance.mostSent.call();
        assert.equal(actualMostSent.toString(), value2.toString(),
            '最大以太幣提交數量錯誤');

        // 驗證以太王
        actualRichest = await instance.richest.call();
        assert.equal(actualRichest, richer2, 'richer2應為以太王');

        // 驗證參賽者可領取餘額
        pendingWithdrawalOfRicher1 = await instance.pendingWithdrawals.call(richer1);
        assert.equal(pendingWithdrawalOfRicher1.toString(), value2.toString(), 'richer1可領取餘額錯誤');
        pendingWithdrawalRicher2 = await instance.pendingWithdrawals.call(richer2);
        assert.equal(pendingWithdrawalRicher2.toString(), '0', 'richer2可領取餘額錯誤');
        pendingWithdrawalRicher3 = await instance.pendingWithdrawals.call(richer3);
        assert.equal(pendingWithdrawalRicher3.toString(), '0', 'richer3可領取餘額錯誤');

        // 驗證richer2餘額
        cost = new BigNumber(receipt.receipt.gasUsed).mul(tx.gasPrice);
        let balanceRicher2 = await web3.eth.getBalance(richer2);
        assert.equal(
            balanceRicher2.toString(), 
            previousBalanceRicher2.minus(cost).minus(value2).toString(),
            'richer2a餘額不一致'
        );

        // 記錄richer3先前餘額
        let previousBalanceRicher3 = await web3.eth.getBalance(richer3);

        // 每次必須至少增加 1 ether
        // ether*2 + 10**17 < 3 ether
        let value3 = new BigNumber(ether).mul(2).plus(new BigNumber(10).pow(17));
        // richer3 競爭成為第三任以太王，但richer3是韭菜，只能被收割
        receipt = await instance.becomeRichest(
            {value: value3, from: richer3}
        );
        tx = await web3.eth.getTransaction(receipt.tx);
        
        // 驗證最大以太幣提交數量
        actualMostSent = await instance.mostSent.call();
        assert.equal(actualMostSent.toString(), value2.toString(),
            '最大以太幣提交數量錯誤');
        
        // 驗證以太王
        actualRichest = await instance.richest.call();
        assert.equal(actualRichest, richer2, 'richer2應為以太王');
        
        // 驗證參賽者可領取餘額
        pendingWithdrawalOfRicher1 = await instance.pendingWithdrawals.call(richer1);
        assert.equal(pendingWithdrawalOfRicher1.toString(), value2.toString(), 'richer1可領取餘額錯誤');
        pendingWithdrawalRicher2 = await instance.pendingWithdrawals.call(richer2);
        assert.equal(pendingWithdrawalRicher2.toString(), '0', 'richer2可領取餘額錯誤');
        pendingWithdrawalRicher3 = await instance.pendingWithdrawals.call(richer3);
        assert.equal(pendingWithdrawalRicher3.toString(), '0', 'richer3可領取餘額錯誤');
        
        // 驗證richer3餘額
        cost = receipt.receipt.gasUsed * tx.gasPrice;
        let balanceRicher3 = await web3.eth.getBalance(richer3);
        assert.equal(
            balanceRicher3.toString(), 
            previousBalanceRicher3.minus(cost).minus(value3).toString(),
            'richer3餘額不一致'
        );

        // 記錄richer1先前餘額
        previousBalanceRicher1 = await web3.eth.getBalance(richer1);

        let value1 = new BigNumber(ether).mul(3);
        // richer1 競爭成為第三任以太王
        receipt = await instance.becomeRichest(
            {value: value1, from: richer1}
        );
        tx = await web3.eth.getTransaction(receipt.tx);
        
        // 驗證最大以太幣提交數量
        actualMostSent = await instance.mostSent.call();
        assert.equal(actualMostSent.toString(), value1.toString(),
            '最大以太幣提交數量錯誤');
        
        // 驗證以太王
        actualRichest = await instance.richest.call();
        assert.equal(actualRichest, richer1, 'richer1應為以太王');
        
        // 驗證參賽者可領取餘額
        pendingWithdrawalOfRicher1 = await instance.pendingWithdrawals.call(richer1);
        assert.equal(pendingWithdrawalOfRicher1.toString(), value2.toString(), 'richer1可領取餘額錯誤');
        pendingWithdrawalRicher2 = await instance.pendingWithdrawals.call(richer2);
        assert.equal(pendingWithdrawalRicher2.toString(), value1.toString(), 'richer2可領取餘額錯誤');
        pendingWithdrawalRicher3 = await instance.pendingWithdrawals.call(richer3);
        assert.equal(pendingWithdrawalRicher3.toString(), '0', 'richer3可領取餘額錯誤');
        
        // 驗證richer1餘額
        cost = new BigNumber(receipt.receipt.gasUsed).mul(tx.gasPrice);
        balanceRicher1 = await web3.eth.getBalance(richer1);
        assert.equal(
            balanceRicher1.toString(), 
            previousBalanceRicher1.minus(cost).minus(value1).toString(),
            'richer1餘額不一致'
        );
        
        // 記錄richer2先前餘額
        previousBalanceRicher2 = await web3.eth.getBalance(richer2);

        // richer2選擇退場
        receipt = await instance.withdraw({from: richer2});
        tx = await web3.eth.getTransaction(receipt.tx);

        // 驗證最大以太幣提交數量
        actualMostSent = await instance.mostSent.call();
        assert.equal(actualMostSent.toString(), value1.toString(),
            '最大以太幣提交數量錯誤');

        // 驗證以太王
        actualRichest = await instance.richest.call();
        assert.equal(actualRichest, richer1, 'richer1應為以太王');

        // 驗證參賽者可領取餘額
        pendingWithdrawalOfRicher1 = await instance.pendingWithdrawals.call(richer1);
        assert.equal(pendingWithdrawalOfRicher1.toString(), value2.toString(), 'richer1可領取餘額錯誤');
        pendingWithdrawalRicher2 = await instance.pendingWithdrawals.call(richer2);
        assert.equal(pendingWithdrawalRicher2.toString(), '0', 'richer2可領取餘額錯誤');
        pendingWithdrawalRicher3 = await instance.pendingWithdrawals.call(richer3);
        assert.equal(pendingWithdrawalRicher3.toString(), '0', 'richer3可領取餘額錯誤');

        // 驗證richer2餘額
        cost = new BigNumber(receipt.receipt.gasUsed).mul(tx.gasPrice);
        balanceRicher2 = await web3.eth.getBalance(richer2);
        assert.equal(
            balanceRicher2.toString(), 
            previousBalanceRicher2.minus(cost).plus(value1).toString(),
            'richer2b餘額不一致'
        );

        // 記錄richer1先前餘額
        previousBalanceRicher1 = await web3.eth.getBalance(richer1);

        // richer1成為以太王並收割韭菜
        receipt = await instance.stop({from: richer1});
        tx = await web3.eth.getTransaction(receipt.tx);

        // // 驗證最大以太幣提交數量
        actualMostSent = await instance.mostSent.call();
        assert.equal(actualMostSent.toString(), value1.toString(),
            '最大以太幣提交數量錯誤');

        // // 驗證以太王
        actualRichest = await instance.richest.call();
        assert.equal(actualRichest, richer1, 'richer1應為以太王');

        // 驗證參賽者可領取餘額
        pendingWithdrawalOfRicher1 = await instance.pendingWithdrawals.call(richer1);
        // 雖然還有代領取餘額，但以太王執行收割，想再領也會報錯
        assert.equal(pendingWithdrawalOfRicher1.toString(), value2.toString(), 'richer1可領取餘額錯誤');
        pendingWithdrawalRicher2 = await instance.pendingWithdrawals.call(richer2);
        assert.equal(pendingWithdrawalRicher2.toString(), '0', 'richer2可領取餘額錯誤');
        pendingWithdrawalRicher3 = await instance.pendingWithdrawals.call(richer3);
        assert.equal(pendingWithdrawalRicher3.toString(), '0', 'richer3可領取餘額錯誤');

        // 驗證richer1餘額
        cost = receipt.receipt.gasUsed * tx.gasPrice;
        balanceRicher1 = await web3.eth.getBalance(richer1);
        assert.equal(
            balanceRicher1.toString(), 
            previousBalanceRicher1
                .minus(cost)
                .plus(valueInit) 
                .plus(value2)
                .plus(value3)
                .toString(),
            'richer1餘額不一致'
        );

        // 最後印出餘額
        let baseline = await web3.eth.getBalance(accounts[3]);
        balanceRicher1 = await web3.eth.getBalance(richer1);
        balanceRicher2 = await web3.eth.getBalance(richer2);
        balanceRicher3 = await web3.eth.getBalance(richer3);
        console.log('baseline: %s', baseline.toString());
        console.log(' richer1: %s, win?: %s', 
            balanceRicher1.toString(), balanceRicher1.gt(baseline));
        console.log(' richer2: %s, win?: %s', 
            balanceRicher2.toString(), balanceRicher2.gt(baseline));
        console.log(' richer3: %s, win?: %s', 
            balanceRicher3.toString(), balanceRicher3.gt(baseline));
    });

    it('應結束遊戲並將收割結果送至指定錢包', async function () {
        let startAt = new Date('2018-01-01').getTime() / 1000;
        let valueInit = new BigNumber(ether);
        let instance = await Withdraw.new(
            startAt, {value: valueInit, from: richer1});
        // 在Truffle呼叫多載會失敗，請等待下述Issue被解決
        // https://github.com/trufflesuite/truffle/issues/737
        /*
        await instance.stop(secretWallet, {from: richer1}); // 呼叫多載
        let actualBalance = await web3.eth.getBalance(instance.address);
        assert.equal(actualBalance.toNumber(), 0, '合約餘額不一致');
        actualBalance = await web3.eth.getBalance(secretWallet);
        assert.equal(actualBalance.toNumber(), valueInit.toNumber(),
            '錢包餘額不一致');
        */
    });

    it('應因不是以太王而無法結束遊戲', async function () {
        // 1小時候遊戲才能結束
        let startAt = new Date('2018-01-01').getTime() / 1000;
        // console.log(startAt);
        let valueInit = new BigNumber(ether);

        // richer1 是部署合約的人，也是第一任以太王
        let instance = await Withdraw.new(
            startAt, {value: valueInit, from: richer1});

        let thrown = false;
        try {
            await instance.stop({from: richer3});
        } catch (e) {
            thrown = true;
        }
        assert.isTrue(thrown);

        let actualBalance = await web3.eth.getBalance(instance.address);
        assert.equal(actualBalance.toString(), valueInit.toString(), '合約餘額不一致');
    });

    it('應無法提前結束遊戲', async function () {
        // 1小時候遊戲才能結束
        let startAt = Math.floor(Date.now() / 1000) + 3600;
        // console.log(startAt);
        let valueInit = new BigNumber(ether);

        // richer1 是部署合約的人，也是第一任以太王
        let instance = await Withdraw.new(
            startAt, {value: valueInit, from: richer1});

        let thrown = false;
        try {
            await instance.stop({from: richer1});
        } catch (e) {
            thrown = true;
        }
        assert.isTrue(thrown);

        let actualBalance = await web3.eth.getBalance(instance.address);
        assert.equal(actualBalance.toString(), valueInit.toString(), '合約餘額不一致');

        // 注意: 在測試環境中，每個測試案例在同一個測試程式碼中會共用測試用帳戶餘額
        let baseline = await web3.eth.getBalance(accounts[3]);
        balanceRicher1 = await web3.eth.getBalance(richer1);
        balanceRicher2 = await web3.eth.getBalance(richer2);
        balanceRicher3 = await web3.eth.getBalance(richer3);
        console.log('baseline: %s', baseline.toString());
        console.log(' richer1: %s', balanceRicher1.toString());
        console.log(' richer2: %s', balanceRicher2.toString());
        console.log(' richer3: %s', balanceRicher3.toString());
    });
})