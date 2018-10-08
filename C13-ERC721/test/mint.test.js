const BigNumber = web3.BigNumber;
const ExtERC721 = artifacts.require('ExtERC721');

contract('Test mint() of ExtERC721', async (accounts) => {

    let extERC721;
    let admin = accounts[0];
    let owner1 = accounts[1];

    beforeEach(async () => {
        // Deploy contract
        let name = "Good Ledger";
        let symbol = "GL";
        extERC721 = await ExtERC721.new(name, symbol, {from: admin});
    });

    it('should mint token to owner', async function () {
        // Mint token to owner.
        let tokenId = new BigNumber(0);
        let tokenURI = "https://some.url/tokenId";
        await extERC721.mintWithTokenURI(
            owner1, tokenId, tokenURI, {from: admin});
        
        // Verify owner balance.
        let balance = await extERC721.balanceOf(owner1);
        assert.equal(balance.toString(), "1", 'Balance is incorrect');

        // Verify token owner.
        let owner = await extERC721.ownerOf(tokenId);
        assert.equal(owner.toString(), owner1.toString(), 'Owner is incorrect');

        // Verify total supply.
        let totalSupply = await extERC721.totalSupply();
        assert.equal(totalSupply.toString(), "1", 'Total supply is incorrect');

        // Verify token URI.
        let uri = await extERC721.tokenURI(tokenId);
        assert.equal(uri, tokenURI, 'URI is incorrect');
    });
})