const BigNumber = web3.BigNumber;
const ecRecovers = artifacts.require('ECRecovers');
const web3Utils = require('web3-utils');

contract('Test recover signer by ecrecover()', async (accounts) => {

    let main;
    let admin = accounts[0];

    beforeEach(async () => {
        main = await ecRecovers.new({from: admin});
    });

    it('should recover signer from hash', async function () {
        // Signature generated outside testrpc with method web3.eth.sign(signer, message)
        let signer = '0x2cc1166f6212628a0deef2b33befb2187d35b86c';
        // web3.sha3('OpenZeppelin')
        let hash = '0x7dbaf558b0a1a5dc7a67202117ab143c1d8605a983e4a743bc06fcc03162dc0d'; // web3.sha3('OpenZeppelin')
        // eslint-disable-next-line max-len
        let signature = '0x5d99b6f7f6d1f73d1a26497f2b1c89b24c0993913f86e9a2d02cd69887d9c94f3c880358579d811b21dd1b7fd9bb01c1d81d10e69f0384e675c32b39643be89200';

        let actualSigner = await main.recoverSigner(hash, signature);
        assert.equal(signer, actualSigner);
    });

    it('should recover signer from hash (hashed in test)', async function () { 
        let signer = '0x41bdd852d3618dc5d6338279f373bf7935dc0242';   
        let baseMessage = 'sullof';    
        let fullMessage = `\x19Ethereum Signed Message:\n${baseMessage.length}${baseMessage}`
        let hash = web3.sha3(fullMessage)    
        // eslint-disable-next-line max-len
        let signature = '0x335473213ac39fb66c74e8b23523583544389eef70e8bce4cc455cb41662083b1fe6981161e68c29e25fe65fb40f49f2c8adecfb0a1eda8d1c55a0c127e50cb01c';
        let actualSigner = await main.recoverSigner(hash, signature);
        assert.equal(signer, actualSigner);    
    });

    it('should recover signer from SHA3 data', async function () {
        let addr = accounts[8];
        let num = new BigNumber(100);
        let baseMessage = addr + num.toString();

        let signer = accounts[1];       
        let fullMessage = `\x19Ethereum Signed Message:\n${baseMessage.length}${baseMessage}`;
        let message = web3.sha3(fullMessage);
        let signature = await web3.eth.sign(signer, message);
        let r = signature.substr(0, 66);
        let s = '0x' + signature.substr(66, 64);
        let v = '0x' + signature.substr(130, 2);
        let v_decimal = web3.toDecimal(v);
        if (v_decimal < 27) {
            v_decimal += 27;
        }
        let actualSigner = await main.recoverSignerFromSHA3Data(
            message, v_decimal, r, s);
        assert.equal(signer, actualSigner);    
    });

    it('should recover signer from raw string', async function () {
        let addr = accounts[8];
        let num = new BigNumber(100);
        let baseMessage = addr + num.toString();

        let signer = accounts[1];
        let message = web3.sha3(baseMessage);
        let signature = await web3.eth.sign(signer, message);
        let r = signature.substr(0, 66);
        let s = '0x' + signature.substr(66, 64);
        let v = '0x' + signature.substr(130, 2);
        let v_decimal = web3.toDecimal(v);
        if (v_decimal < 27) {
            v_decimal += 27;
        }
        let actualSigner = await main.recoverSignerFromRawString(
            baseMessage, v_decimal, r, s
        );
        assert.equal(signer, actualSigner);    
    });

    it('should recover signer from raw string', async function () {
        let addr = accounts[8];
        let num = new BigNumber(100);
        let baseMessage = addr + num.toString();

        let signer = accounts[1];
        let message = web3.sha3(baseMessage);
        let signature = await web3.eth.sign(signer, message);
        let r = signature.substr(0, 66);
        let s = '0x' + signature.substr(66, 64);
        let v = '0x' + signature.substr(130, 2);
        let v_decimal = web3.toDecimal(v);
        if (v_decimal < 27) {
            v_decimal += 27;
        }
        let actualSigner = await main.recoverSignerFromRawString(
            baseMessage, v_decimal, r, s
        );
        assert.equal(signer, actualSigner);    
    });

    it('should recover signer from typed data', async function () {
        let addr = accounts[8];
        let num = new BigNumber(100);

        let signer = accounts[1];
        let message = web3Utils.soliditySha3(addr, num);
        let signature = await web3.eth.sign(signer, message);
        let r = signature.substr(0, 66);
        let s = '0x' + signature.substr(66, 64);
        let v = '0x' + signature.substr(130, 2);
        let v_decimal = web3.toDecimal(v);
        if (v_decimal < 27) {
            v_decimal += 27;
        }
        let actualSigner = await main.recoverSignerFromTypedData(
            addr, num, v_decimal, r, s
        );
        assert.equal(signer, actualSigner);    
    });
})