import assert from 'assert';
import sinon from 'sinon';

import BlockChainsControllerClass from '../src/services/BlockchainService';
import testBlockchain from './fixtures/blockchain';

const founderPrivateKey = 'MIIBOwIBAAJBAJWMA2f+uaZfvl5Q+JInI5uKAbsM6m5vSzwQRjpOh8/uDIVZ0VwlJjCvOsbdePit3CUMwqiO6r2yAJ4zGgY+lWMCAwEAAQJAWYuO9pRWAcNOsBb34DvDXH0UcDZZoWrOt9Ze1sbzF5Nc65xOoJeqpiTYu1OclyC9pGTuGCTZ6UcV5hAeSqcMsQIhANroTXDpZPfwXoUaSd4h3tvxjjwOsWB9YL0+aFod0fJ1AiEAruMDQVMfTM8iOstGRjxmGI2OPpltvOMClKNTDUk9PXcCIDRlAZQS6M3HRHhLMH7wUG0IRejuA1p659qjw0o+dO+5AiEAkvwXG0sqTlr0kOeRq6xNvqsSd0hqc8tzuss+HTeF8ecCIQDB8+gL6ubKkmz6Be3KhHuVtAhHVpcETvgIbbjv2mQEJA=='
const founderPublicKey = 'MEgCQQCVjANn/rmmX75eUPiSJyObigG7DOpub0s8EEY6TofP7gyFWdFcJSYwrzrG3Xj4rdwlDMKojuq9sgCeMxoGPpVjAgMBAAE=';

const testPrivateKey1 = 'MIIBOwIBAAJBAOulXQoQd9SIAxpkTvaVbCHpfjAs8euX5KrhDtH6c8Ca5C9pWcjjMNpe6HorGIruh2JTvuIvl2lMg15gRje/XwECAwEAAQJAcASR7+DYNe3aG8enSczKNGy8kcYr0mTITPrjgqneMKYHVes/TjnMCiUaZjMPnhRN5gZXj5ZOns3PuueU9O0sYQIhAPres2GsW+XKadcltxGpN0ek/Ut2zTMYQHWGx4hA7+w1AiEA8Hb3K9GUAuYjeWYXhMblN2eUoDylT7cNaesxNLcsyR0CIQCkHDtMkewsDpXeYJW5v/ChtZTdYQIrgpnoSBsPTyukYQIgALn7STCa599WIBnE3GvVaXNwqYNFZJZC/hztyyD6i6kCIQCQex7e+zx9T4rTerQzcn2+Su7YJF5oFx0I3hPS7EdJCA==';
const testPublicKey1 = 'MEgCQQDrpV0KEHfUiAMaZE72lWwh6X4wLPHrl+Sq4Q7R+nPAmuQvaVnI4zDaXuh6KxiK7odiU77iL5dpTINeYEY3v18BAgMBAAE=';
const testPrivateKey2 = 'MIIBPAIBAAJBAN+wtGoL9BESrdw5qm7CNF1whttFUIhbV1XVzDFVFkcB36sLBzQ2h5NJB8wy+mVFrgFzwzwskQAsQmqdg/bx4q8CAwEAAQJBAMbw8yO1idV9VV8dcjSbR9MqduWgmeULx3qxcK8XS37NxAHIEI/97ull+/WIQ+/4yGU4LLJThlIHpOVbmokEh0ECIQD1e2sJE61WJxHMTFPtSZBlB/AsK56ilteOPyuITbdP/wIhAOlGQwA57dbZ3al7DniVLsLY/f2Q7UFfPybjTD8NHm1RAiA6S1uopSaVfeOpGzsW71A93bu4EYezXpTDr9aboLD2awIhAK1hQY87fyD/URcUlU7eYqEDstPyEcVSy5dVvWfnkkPhAiEA1VbiBh2f+AaM55HAB76QgCik9O6KlC2uY1tDfIkAiJo=';
const testPublicKey2 = 'MEgCQQDfsLRqC/QREq3cOapuwjRdcIbbRVCIW1dV1cwxVRZHAd+rCwc0NoeTSQfMMvplRa4Bc8M8LJEALEJqnYP28eKvAgMBAAE=';

describe('BlockChainsController', function () {
    const BlockChainsController = new BlockChainsControllerClass;
    BlockChainsController.level = 5;
    let emit = sinon.spy();
    BlockChainsController.emit = emit;

    it('should generate keys pair', function () {
        BlockChainsController.privateKey = "";
        assert.equal(BlockChainsController.privateKey, "");
        BlockChainsController.generateKeyPair();
        assert.notEqual(BlockChainsController.privateKey, "");
        //assert.equal(emit.calledWith('refreshKeys'), true);
    });

    it('should import founder private key', function () {
        BlockChainsController.importPrivateKey(founderPrivateKey);
        assert.equal(BlockChainsController.privateKey, founderPrivateKey);
        assert.equal(BlockChainsController.publicKey, founderPublicKey);
    });

    it('should generate genesis block', function () {
        BlockChainsController.createGenesisBlock(founderPublicKey);
        assert.equal(BlockChainsController.blockChain.length, 1);
        let actualBlockChain = BlockChainsController.getBlockChain();
        assert.equal(actualBlockChain[0].N, 0);
        assert.equal(actualBlockChain[0].prevBlockHash, 0);
    });

    it('founder should have balance equal to reward', function () {
        assert.equal(BlockChainsController.balanceOf(founderPublicKey), BlockChainsController.reward);
        assert.equal(BlockChainsController.balanceOf(testPublicKey1), 0);
        assert.equal(BlockChainsController.balanceOf(testPublicKey2), 0);
    });

    it('should create transaction', function () {
        let newTransaction = BlockChainsController.createTransaction(founderPublicKey, testPublicKey1, 5);
        assert.notEqual(newTransaction, false);

        let firstTxAddResult = BlockChainsController.addTransactionToPool(newTransaction);
        assert.equal(firstTxAddResult, 1);
        // второй раз одна и та же транзакция не пройдет
        let secondTxAddResult = BlockChainsController.addTransactionToPool(newTransaction);
        assert.notEqual(secondTxAddResult, true);
    });

    it('should start generating new block from pool', function () {
        assert.equal(BlockChainsController.canGenerateBlock(), true);

        BlockChainsController.startBlockGeneration();
        assert.equal(BlockChainsController.blockGeneration, true);
        assert.equal(BlockChainsController.blockGenerationTransactions.length, BlockChainsController.blockSize + 1); // размер + награда
    });

    it('should mine new block', function () {
        let n = 0;
        let resBlock;
        while (BlockChainsController.blockGeneration && (n < 1000)) {
            resBlock = BlockChainsController.generateBlock();
            n++;
        }

        BlockChainsController.addBlock(resBlock);

        console.log(resBlock, BlockChainsController.blockChain);

        assert.equal(resBlock.N, 1);
        //assert.equal(resBlock.prevBlockHash, BlockChainsController.blockChain[0].blockHash);
        console.log("New block generation attempts count:", BlockChainsController.blockGenerationStep);
    });

    it('should reward miner', function () {
        //console.log(BlockChainsController.calculateBalances(BlockChainsController.getBlockChain()));
        //console.log(BlockChainsController.getBlockChain()[0].transactions);
        assert.equal(BlockChainsController.balanceOf(founderPublicKey), BlockChainsController.reward * 2 - 5);
    });

    it('should not accept previously used transaction', function () {
        let firstTransaction = BlockChainsController.getBlockChain()[0].transactions[0];
        let addResult = BlockChainsController.addTransactionToPool(firstTransaction);
        assert.notEqual(addResult, true);
        // console.log(firstTransaction);
    });

    it('should not accept transaction from negative balance', function () {
        let newTransaction = BlockChainsController.createTransaction(founderPublicKey, testPublicKey1, 500);
        let addResult = BlockChainsController.addTransactionToPool(newTransaction);
        assert.notEqual(addResult, true);
    });

    it('should validate blockchain', function () {
        assert.equal(BlockChainsController.validateBlockChain(BlockChainsController.getBlockChain()), true);
    });
});


describe('Import test blockchain', function () {
    const BlockChainsController = new BlockChainsControllerClass;
    BlockChainsController.level = 5;

    it('should import from test blockchain', function () {
        BlockChainsController.addBlockChain(testBlockchain);
        assert.equal(BlockChainsController.nextBlockN(), 3);
    });

    it('should load from localstorage', function(){
        BlockChainsController.saveState();
        BlockChainsController.privateKey = "new key";
        BlockChainsController.loadState();
        assert.notEqual(BlockChainsController.privateKey, "new key")
    });

    it('should get all transaction', function(){
        let transactions = BlockChainsController.getAllTransactions();
        assert.equal(transactions.length, 5);
    });
});
