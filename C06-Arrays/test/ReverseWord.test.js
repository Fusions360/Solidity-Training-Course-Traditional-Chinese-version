const ReverseWord = artifacts.require('ReverseWord');

contract('測試ReverseWord合約', async (accounts) => {
    
    let instant;

    beforeEach(async () => {
        instant = await ReverseWord.new({from: accounts[0]});
    });

    it('應反轉字串', async function () {
        let word = 'love';
        // 使用call()取得回傳結果
        // 沒有使用call()的正常情況會回傳交易收據
        // 取得合約狀態getter()不必特別加上call()
        let reversed = await instant.reverseWord.call(word, {from: accounts[0]});
        console.log(reversed);
        assert.equal(reversed, 'evol', '應反轉字');
    });
})