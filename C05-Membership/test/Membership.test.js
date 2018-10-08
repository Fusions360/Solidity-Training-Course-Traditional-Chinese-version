const Membership = artifacts.require('Membership');
const BigNumber = web3.BigNumber;

contract('測試Membership合約', async (accounts) => {

    let membership;
    let member = accounts[1];
    
    beforeEach(async () => {
        membership = await Membership.new({from: accounts[0]});
    });

    it('應註冊成為會員，購買直至成為VVIP，最後刪除帳號', async function () {
        // 冊成為會員
        let name = 'Kevin Kuo';
        await membership.register(name, {from: member});
        let actualMember = await membership.members(member);
        assert.equal(actualMember[0], name, '名字不一致');
        assert.equal(actualMember[1].toString(), '0', '點數應為0');
        assert.equal(actualMember[2].toString(), '0', '應為Basic級別');

        // 購買直至成為VVIP
        for (let i = 1; i <= 10; i++) {
            // 每花100元得1點，每次增加100點數
            await membership.shop(10098, {from: member});
            actualMember = await membership.members(member);
            assert.equal(actualMember[0], name, '名字不一致');
            assert.equal(actualMember[1].toString(), 
                new BigNumber(100).times(i).toString(), '點數不一致');
            if (i >= 10) {
                assert.equal(actualMember[2].toString(), '2', '應為VVIP級別');
            } else if (i >= 5) {
                assert.equal(actualMember[2].toString(), '1', '應為VIP級別');
            } else {
                assert.equal(actualMember[2].toString(), '0', '應為Basic級別');
            }
        }

        // 刪除帳號
        await membership.unregister({from: member});
        actualMember = await membership.members(member);
        assert.equal(actualMember[0], '', '名字不一致');
        assert.equal(actualMember[1].toString(), '0', '點數應為0');
        assert.equal(actualMember[2].toString(), '0', '應為Basic級別');
    });
})