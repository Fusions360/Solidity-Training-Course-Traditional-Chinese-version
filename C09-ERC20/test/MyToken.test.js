const MyToken = artifacts.require('MyToken');
const BigNumber = web3.BigNumber;

contract('測試MyToken合約', async (accounts) => {

    const NAME = 'My Token';
    const SYMBOL = 'MYT';
    const DECIMALS = 18;

    let owner = accounts[0];
    let user1 = accounts[1];

    it('應成功部署合約並造幣', async function () {
        let token = await MyToken.new(
            NAME, SYMBOL, DECIMALS, {from: owner});
        let mintAmount = new BigNumber((10**18) * 10000);
        await token.mint(owner, mintAmount, {from: owner});

        let name = await token.name();
        assert.equal(name, NAME, '名稱錯誤');

        let symbol = await token.symbol();
        assert.equal(symbol, SYMBOL, '代號錯誤');

        let decimals = await token.decimals();
        assert.equal(decimals, DECIMALS, '小數點位數錯誤');

        let totalSupply = await token.totalSupply();
        assert.equal(totalSupply.toNumber(), mintAmount.toNumber(), 
            '總發幣數量錯誤');

        let balance = await token.balanceOf(owner);
        assert.equal(balance.toNumber(), mintAmount.toNumber(), 
            'owner代幣餘額錯誤');

        let finished = await token.mintingFinished();
        assert.equal(finished, false, '應未停止造幣');

        await token.finishMinting({from: owner});
        finished = await token.mintingFinished();
        assert.equal(finished, true, '應已停止造幣');
    });

    it('應成功轉帳', async function () {
        let token = await MyToken.new(
            NAME, SYMBOL, DECIMALS, {from: owner});
        let mintAmount = new BigNumber((10**18) * 10000);
        await token.mint(owner, mintAmount, {from: owner});

        let transferAmount = new BigNumber((10**18) * 10);
        await token.transfer(user1, transferAmount, {from: owner});

        let balanceOfOwner = await token.balanceOf(owner);
        assert.equal(balanceOfOwner.toNumber(), 
            mintAmount.sub(transferAmount).toNumber(), 
            'owner代幣餘額錯誤');
        
        let balanceOfUser1 = await token.balanceOf(user1);
        assert.equal(balanceOfUser1.toNumber(), transferAmount.toNumber(), 
            'owner代幣餘額錯誤');
    });

    it('應成功搶紅包，大灑幣', async function () {
        let token = await MyToken.new(
            NAME, SYMBOL, DECIMALS, {from: owner});
        
        let transferAmount = new BigNumber((10**18) * 10);
        let mintAmount = transferAmount.mul(3);
        await token.mint(owner, mintAmount, {from: owner});

        for (let i = 1; i <= 5; i++) {
            await token.approve(accounts[i], transferAmount, {from: owner});
        }
        
        let balance;
        let balanceOfOwner;
        for (let i = 1; i <= 5; i++) {
            if (i <= 3) {
                await token.transferFrom(
                    owner, accounts[i], transferAmount, {from: accounts[i]}
                );
                balance = await token.balanceOf(accounts[i]);
                assert.equal(balance.toNumber(), transferAmount.toNumber(), 
                    'user代幣餘額錯誤');

                balanceOfOwner = await token.balanceOf(owner);
                assert.equal(balanceOfOwner.toNumber(), 
                    mintAmount.sub(transferAmount.mul(i)).toNumber(), 
                    'owner代幣餘額錯誤');
            } else {
                let thrown = true;
                try {
                    await token.transferFrom(
                        owner, accounts[i], transferAmount, {from: accounts[i]}
                    );
                } catch (e) {
                    thrown = true;
                }
                assert.isTrue(thrown);
                balance = await token.balanceOf(accounts[i]);
                assert.equal(balance.toNumber(), 0, 'user代幣餘額錯誤');

                balanceOfOwner = await token.balanceOf(owner);
                assert.equal(balanceOfOwner.toNumber(), 0, 'owner代幣餘額錯誤');
            }
        }
    });
});