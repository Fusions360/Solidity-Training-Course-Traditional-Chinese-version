const SampleCrowdsaleToken = artifacts.require('SampleCrowdsaleToken');
const SampleCrowdsale = artifacts.require('SampleCrowdsale');
const BigNumber = web3.BigNumber;

contract('Test SampleCrowdsale contract', async (accounts) => {

    let owner = accounts[0];

    it('should successfully deploy SampleCrowdsale contract', async function () {
        let token = await SampleCrowdsaleToken.new({from: owner});
        assert.ok(token.address);
        let openingTime = new BigNumber(Math.floor(Date.now() / 1000)); // Now
        let closingTime = openingTime.add(3600); // One hour later
        let rate = new BigNumber(10);
        let wallet = accounts[1];
        let cap = new BigNumber((10**18) * (1000)); // 1000 ether
        let goal = new BigNumber((10**18) * (100)); // 100 ether
        let crowdsale = await SampleCrowdsale.new(openingTime, closingTime, 
            rate, wallet, cap, token.address, goal, {from: owner});
        assert.ok(crowdsale.address);
        let actualOpeningTime = await crowdsale.openingTime();
        assert.equal(actualOpeningTime.toNumber(), openingTime.toNumber(), 
            'Opening time is incorrect.');
        let actualClosingTime = await crowdsale.closingTime();
        assert.equal(actualClosingTime.toNumber(), closingTime.toNumber(), 
            'Closing time is incorrect.');
        let actualRate = await crowdsale.rate();
        assert.equal(actualRate.toNumber(), rate.toNumber(), 'Rate is incorrect.');
        let actualWallet = await crowdsale.wallet();
        assert.equal(actualWallet, wallet, 'Wallet address is incorrect.');
        let actualCap= await crowdsale.cap();
        assert.equal(actualCap.toNumber(), cap.toNumber(), 'Cap is incorrect.');
        let actualGoal = await crowdsale.goal();
        assert.equal(actualGoal.toNumber(), goal.toNumber(), 'Goal is incorrect.');
        let actualToken = await crowdsale.token();
        assert.equal(actualToken, token.address, 'Token address is incorrect.');
    });
})