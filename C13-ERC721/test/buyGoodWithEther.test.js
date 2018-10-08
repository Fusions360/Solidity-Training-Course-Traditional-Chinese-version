const BigNumber = web3.BigNumber;
const ERC20Full = artifacts.require('ERC20Full');
const ExtERC721 = artifacts.require('ExtERC721');
const GoodShop = artifacts.require('GoodShop');

contract('Test buy good with Ether', async (accounts) => {

    let tokens;
    let goods;
    let shop;
    let admin = accounts[0];
    let tokenWallet = accounts[1];
    let etherWallet = accounts[2];
    let owner1 = accounts[3];

    // Define good unit price.
    const tokenPrice = new BigNumber(50000)
        .times(new BigNumber(10).pow(18)); // 50,000 TWD
    const weiPrice = new BigNumber(2)
        .times(new BigNumber(10).pow(18)); // 2 ETH

    beforeEach(async () => {
        // Deploy ERC20 token contract
        let tokenName = "Good Token";
        let tokenSymbol = "GT";
        let decimals = new BigNumber(18);
        tokens = await ERC20Full.new(tokenName, tokenSymbol, 
            decimals, {from: admin});
        
        // Deploy ERC721 NFT (Non-Fungible Tokens) contract
        let name = "Good Ledger";
        let symbol = "GL";
        goods = await ExtERC721.new(name, symbol, {from: admin});

        // Deploy main contract (testing target): GoodShop.
        shop = await GoodShop.new(goods.address, tokens.address, 
            tokenWallet, etherWallet, tokenPrice, weiPrice, {from: admin});

        // Register GoodShop as a merchant.
        // Only merchant can use use token payment.
        await tokens.addMerchant(shop.address, {from: admin});

        // Register GoodShop as a minter.
        // Only minter can mint NFT token (create new good).
        await goods.addMinter(shop.address, {from: admin});
    });

    it('should buy good (use Ether)', async function () {
        // Log previous ether balances.
        let previousOwner1EtherBalance = await web3.eth.getBalance(owner1);
        let previousEtherWalletBalance = await web3.eth.getBalance(etherWallet);

        // Use ether to buy good by calling fallback function.
        let hash = await shop.sendTransaction({from: owner1, value: weiPrice});
        let tx = await web3.eth.getTransaction(hash.tx);
        let cost = new BigNumber(hash.receipt.gasUsed).times(tx.gasPrice);

        // Verify owner1 balance (Ether)
        let owner1EtherBalance = await web3.eth.getBalance(owner1);
        assert.equal(
            owner1EtherBalance.toString(), 
            previousOwner1EtherBalance.minus(weiPrice).minus(cost).toString(),
            'Owner1 balance is incorrect (Ether)'
        );

        // Verify ether wallet balance (Ether)
        let etherWalletBalance = await web3.eth.getBalance(etherWallet);
        assert.equal(
            etherWalletBalance.toString(), 
            previousEtherWalletBalance.plus(weiPrice).toString(),
            'Ether wallet balance is incorrect (Ether)'
        );
        
        // Verify owner1 balance. (ERC721)
        owner1Bal = await goods.balanceOf(owner1);
        assert.equal(owner1Bal.toString(), "1", 
            'Balance is incorrect (ERC721)');

        // Verify token owner. (ERC721)
        let tokenId = new BigNumber(0); // First token ID should be 0.
        let tokenOwner = await goods.ownerOf(tokenId);
        assert.equal(tokenOwner.toString(), owner1.toString(),
            'Token owner is incorrect (ERC721)');

        // Verify total supply. (ERC721)
        let totalSupply = await goods.totalSupply();
        assert.equal(totalSupply.toString(), "1", 
            'Total supply is incorrect (ERC721)');
    });
})