const BigNumber = web3.BigNumber;
const ExtERC721 = artifacts.require('ExtERC721');

contract('Test burn() of ExtERC721', async (accounts) => {

    let extERC721;
    let admin = accounts[0];
    let owner1 = accounts[1];

    let tokenId = new BigNumber(0);

    beforeEach(async () => {
        // Deploy contract
        let name = "Good Ledger";
        let symbol = "GL";
        extERC721 = await ExtERC721.new(name, symbol, {from: admin});

        // Mint token to owner.
        await extERC721.mint(owner1, tokenId, {from: admin});
    });

    it('should burn token to owner', async function () {
        // Burn token.
        await extERC721.burn(tokenId, {from: owner1});
        
        // Verify owner balance.
        let balance = await extERC721.balanceOf(owner1);
        assert.equal(balance.toString(), "0", 'Balance is incorrect');

        // Verify total supply.
        let totalSupply = await extERC721.totalSupply();
        assert.equal(totalSupply.toString(), "0", 'Total supply is incorrect');
    });
})