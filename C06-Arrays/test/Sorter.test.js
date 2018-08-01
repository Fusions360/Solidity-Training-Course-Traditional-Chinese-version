const Sorter = artifacts.require('Sorter');
const BigNumber = web3.BigNumber;

contract('測試Sorter合約', async (accounts) => {
    
    let instant;

    beforeEach(async () => {
        instant = await Sorter.new({from: accounts[0]});
    });

    it('應執行排序', async function () {
        let array = [1, 3, 9, 13, 5, 11, 7];
        await instant.set(array, {from: accounts[0]});
        let raw = await instant.get.call();
        assert.equal(raw[0].toNumber(), 1, '設定結果不正確');
        assert.equal(raw[1].toNumber(), 3, '設定結果不正確');
        assert.equal(raw[2].toNumber(), 9, '設定結果不正確');
        assert.equal(raw[3].toNumber(), 13, '設定結果不正確');
        assert.equal(raw[4].toNumber(), 5, '設定結果不正確');
        assert.equal(raw[5].toNumber(), 11, '設定結果不正確');
        assert.equal(raw[6].toNumber(), 7, '設定結果不正確');

        await instant.sort({from: accounts[0]});
        let sorted = await instant.get.call();
        assert.equal(sorted[0].toNumber(), 1, '排序結果不正確');
        assert.equal(sorted[1].toNumber(), 3, '排序結果不正確');
        assert.equal(sorted[2].toNumber(), 5, '排序結果不正確');
        assert.equal(sorted[3].toNumber(), 7, '排序結果不正確');
        assert.equal(sorted[4].toNumber(), 9, '排序結果不正確');
        assert.equal(sorted[5].toNumber(), 11, '排序結果不正確');
        assert.equal(sorted[6].toNumber(), 13, '排序結果不正確');
    });
})