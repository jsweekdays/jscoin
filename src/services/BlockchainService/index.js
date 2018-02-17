import NodeRSA from 'node-rsa'
import sha256 from 'js-sha256'
import Hex2Bin from './helpers/Hex2Bin'
import EventEmitter from 'wolfy87-eventemitter'
import NonceGenerator from './helpers/NonceGenerator'
import testBlockChain from '../../../test/fixtures/blockchain'

export const EVENT_MINER_ATTEMPT = 'miner.attempt'
export const EVENT_MINER_START = 'miner.start'
export const EVENT_MINER_ERROR = 'miner.error'
export const EVENT_MINER_SUCCESS = 'miner.block'

export const EVENT_BALANCE = 'blockchain.balance'
export const EVENT_BLOCKCHAIN_UPDATE = 'blockchain.update'
export const EVENT_TRANSACTIONS_UPDATE = 'blockchain.transacation'
export const EVENT_KEYS_UPDATE = 'blockchain.keys'

export const TRANSACTION_REWARD = 'reward'

export default class BlockChainsControllerClass extends EventEmitter {
  constructor (settings) {
    super()
    this.blockChain = []
    this.pool = []
    this.privateKey = ''
    this.publicKey = ''
    this.nodeRSA = new NodeRSA(512)
    this.level = 5
    this.reward = 10
    this.blockSize = 1

    this.loadState()

    if (!this.privateKey) {
      this.generateKeyPair()
    }
  }

  test () {
    this.emitEvent(EVENT_BALANCE)
    return 25 + this.reward
  }

  startTest () {
    setTimeout(() => {
      this.emit(EVENT_BALANCE, 25 + this.reward)
    }, 5000)
  }

  addTestBlockChain () {
    this.blockChain = []
    this.addBlockChain(testBlockChain)
  }

  generateKeyPair () {
    this.nodeRSA.generateKeyPair(512)

    this.privateKey = this.nodeRSA.exportKey('pkcs1-private-der').toString('base64')
    this.publicKey = this.nodeRSA.exportKey('pkcs1-public-der').toString('base64')

    this.emit(EVENT_KEYS_UPDATE, {
      privateKey: this.privateKey,
      publicKey: this.publicKey
    })
    this.saveState()
  }

  importPrivateKey (privateKey) {
    this.nodeRSA.importKey(Buffer.from(privateKey, 'base64'), 'pkcs1-private-der')

    this.privateKey = this.nodeRSA.exportKey('pkcs1-private-der').toString('base64')
    this.publicKey = this.nodeRSA.exportKey('pkcs1-public-der').toString('base64')

    this.emit(EVENT_KEYS_UPDATE)
    this.emit(EVENT_BALANCE)
    this.saveState()
  }

  addBlockChain (newBlockChain) {
    let validationResult = this.validateBlockChain(newBlockChain)
    if (newBlockChain.length <= this.blockChain.length) {
      validationResult = 'New blockchain too short'
    }

    if (validationResult === true) {
      this.blockChain = newBlockChain

      this.emit(EVENT_BLOCKCHAIN_UPDATE, this.blockChain)
      this.emit(EVENT_BALANCE)
      this.saveState()
    }

    return validationResult
  }

  addBlock (block) {
    let newBlockChain = this.blockChain.slice()
    newBlockChain.push(block)
    return this.addBlockChain(newBlockChain)
  }

  calculateBlockHash (block, nonce) {
    let blockPart = {
      N: block.N,
      prevBlockHash: block.prevBlockHash,
      transactions: block.transactions,
      time: block.time
    }
    return sha256(JSON.stringify(blockPart).toString() + nonce.toString())
  }

  // проверка части блока и хеша на соответсвие контролькому числу
  validateHashLevel (block, nonce) {
    // для нулевого блока nonce не подбирается, пропускаем проверка сложности
    if (block.N === 0) return true
    let sha = Hex2Bin(this.calculateBlockHash(block, nonce))
    let checkStr = new Array(this.level + 1).join('1')
    return sha.substring(0, this.level) === checkStr
  }

  validateBlock (block) {
    let blockHash = this.calculateBlockHash(block, block.nonce)
    if (block.blockHash !== blockHash) return 'Wrong hash'

    // размер блока
    if (((block.N > 0) && (block.transactions.length !== this.blockSize + 1)) ||
      ((block.N === 0) && (block.transactions.length !== this.blockSize))) return 'Wrong block size'

    // проверим транзакции и награду
    let blockRewardCount = 0
    for (let i = 0; i < block.transactions.length; i++) {
      let transaction = block.transactions[i]

      if (!this.validateTransaction(transaction)) return 'Invalid transaction'

      if ((transaction.from === TRANSACTION_REWARD) && (transaction.amount === this.reward)) {
        blockRewardCount++
      }
    }
    if (blockRewardCount !== 1) return 'Invalid block reward'
    if (!this.validateHashLevel(block, block.nonce)) return 'Invalid nonce hash'

    return true
  }

  validateBlockChain (blockChain) {
    if (blockChain.length === 0) return 'Zero length'

    let balances = this.calculateBalances(blockChain)
    // проверка на отрицательный баланс
    for (let key in balances) {
      if ((key !== TRANSACTION_REWARD) && (balances[key] < 0)) return 'Negative balance'
    }

    let txHashes = []

    // проверка хешей блоков
    for (let n = 0; n < blockChain.length; n++) {
      let block = blockChain[n]
      let prevBlock = blockChain[n - 1]
      let validateBlockResult = this.validateBlock(block)
      if (validateBlockResult !== true) return 'Invalid block ' + n + ' with error ' + validateBlockResult

      if (n > 0) {
        if (prevBlock.blockHash !== block.prevBlockHash) return 'Invalid block previous has ' + n
      }

      // проверка уникальности транзакций
      if (n > 0) {
        for (let txN = 0; txN < block.transactions.length; txN++) {
          let transaction = block.transactions[txN]

          if (txHashes.includes(transaction.hash)) {
            return 'Double transactions'
          }
          txHashes.push(transaction.hash)
        }
      }
    }

    return true
  }

  calculateBalances (blockChain) {
    let balances = []
    for (let n = 0; n < blockChain.length; n++) {
      let block = blockChain[n]
      block.transactions.forEach(function (transaction) {
        if (!(transaction.from in balances)) balances[transaction.from] = 0
        if (!(transaction.to in balances)) balances[transaction.to] = 0

        balances[transaction.from] -= parseInt(transaction.amount)
        balances[transaction.to] += parseInt(transaction.amount)
      })
    }
    return balances
  }

  getClientBalance () {
    return this.balanceOf(this.publicKey)
  }

  balanceOf (publicKey) {
    let balances = this.calculateBalances(this.getBlockChain())
    return (publicKey in balances) ? balances[publicKey] : 0
  }

  getBlockChain () {
    return this.blockChain
  }

  getAllTransactions () {
    let transactions = []
    for (let n = 0; n < this.blockChain.length; n++) {
      let block = this.blockChain[n]
      block.transactions.forEach(function (transaction) {
        transactions.push(transaction)
      })
    }
    return transactions
  }

  nextBlockN () {
    return this.getBlockChain().length
  }

  currentBlockN () {
    return this.getBlockChain().length - 1
  }

  prevBlockHash () {
    let prevBlock = this.getBlockChain()[this.currentBlockN()]
    return prevBlock.blockHash
  }

  canGenerateBlock () {
    return this.pool.length >= this.blockSize
  }

  startBlockGeneration () {
    if (!this.canGenerateBlock()) return false
    if (this.blockGeneration) return false

    this.blockGeneration = true
    this.blockGenerationTransactions = this.pool.slice(0, this.blockSize)
    this.pool = this.pool.splice(this.blockSize)
    // добавляем награду за майнинг
    this.blockGenerationTransactions.push(
      this.createTransaction(TRANSACTION_REWARD, this.publicKey, this.reward)
    )
    this.blockGenerationStep = 0
    this.nonce = NonceGenerator.randomNonce()
    return true
  }

  generateBlock () {
    if (!this.blockGeneration) return false

    let newBlockPart = {
      N: this.nextBlockN(),
      prevBlockHash: this.prevBlockHash(),
      transactions: this.blockGenerationTransactions,
      time: Date.now()
    }

    let foundBlock = this.validateHashLevel(newBlockPart, this.nonce)

    if (foundBlock) {
      this.blockGeneration = false

      newBlockPart.nonce = this.nonce
      newBlockPart.blockHash = this.calculateBlockHash(newBlockPart, newBlockPart.nonce)

      let newBlockChain = this.getBlockChain().push(newBlockPart)
      if (this.validateBlockChain(newBlockChain)) {
        this.addBlockChain(newBlockChain)
        return newBlockPart
      } else {
        // мы сгенерировали блок, но актуальный блокчейн изменился
        // возможно если по сети пришел блокчейн больше текущего
        return false
      }
    } else {
      this.nonce = NonceGenerator.randomNonce()
      this.blockGenerationStep++
    }

    return false
    // return foundBlock ? newBlockPart : false;
  }

  validateTransaction (transaction) {
    let nodeRSA
    if (transaction.from !== TRANSACTION_REWARD) {
      nodeRSA = new NodeRSA(512)
      nodeRSA.importKey(Buffer.from(transaction.from, 'base64'), 'pkcs1-public-der')
    }
    let transactionPart = {
      from: transaction.from,
      to: transaction.to,
      amount: transaction.amount,
      time: transaction.time
    }
    let hash = sha256(JSON.stringify(transactionPart))
    let buffer = Buffer.from(hash)

    if (transaction.from === TRANSACTION_REWARD) {
      // для наград проверяем только хеш транзакции, без подписи автора
      return (transaction.hash === hash)
    }
    return (transaction.hash === hash) && nodeRSA.verify(buffer, transaction.signature, 'buffer', 'base64')
  }

  createClientTransaction (reciver, amount) {
    return this.createTransaction(
      this.publicKey,
      reciver,
      amount
    )
  }

  createTransaction (sender, reciver, amount) {
    let transaction = {
      from: sender,
      to: reciver,
      amount: amount,
      time: Date.now()
    }

    let hash = sha256(JSON.stringify(transaction))
    let buffer = Buffer.from(hash)
    transaction.hash = hash
    transaction.signature = this.nodeRSA.sign(buffer, 'base64')

    return this.validateTransaction(transaction) ? transaction : false
  }

  addTransactionToPool (newTransaction) {
    if (!this.validateTransaction(newTransaction)) return 'Invalid transaction'

    for (let i = 0; i < this.pool.length; i++) {
      let transaction = this.pool[i]
      if (transaction.hash === newTransaction.hash) {
        return 'Transaction already in pool'
      }
    }

    let actualBlockChain = this.getBlockChain()
    for (let n = 0; n < actualBlockChain.length; n++) {
      let transactions = actualBlockChain[n].transactions
      for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].hash === newTransaction.hash) {
          return 'Transaction already exists in blockchain'
        }
      }
    }

    if (this.balanceOf(newTransaction.from) < newTransaction.amount) {
      return 'Not enough founds on balance'
    }

    if (newTransaction.amount === 0) {
      return 'Zero amount'
    }

    this.pool.push(newTransaction)
    this.emit(EVENT_TRANSACTIONS_UPDATE, this.pool)
    this.saveState()

    return true
  }

  clearPool () {
    this.pool = []
    this.saveState()
    this.emit(EVENT_TRANSACTIONS_UPDATE, this.pool)
  }

  removeFirstTransactions () {
    this.pool = this.pool.slice(this.blockSize)

    this.saveState()
    this.emit(EVENT_TRANSACTIONS_UPDATE, this.pool)
  }

  getTransactions () {
    return this.pool
  }

  genesis () {
    this.createGenesisBlock(this.publicKey)
  }

  createGenesisBlock (founder) {
    // создание нулевого блока
    let initialTransaction = {
      from: TRANSACTION_REWARD,
      to: founder,
      amount: this.reward,
      time: Date.now()
    }
    initialTransaction.hash = sha256(JSON.stringify(initialTransaction))

    let genesisBlock = {
      N: 0,
      prevBlockHash: 0,
      transactions: [
        initialTransaction
      ],
      time: Date.now(),
      nonce: 0
    }
    genesisBlock.blockHash = this.calculateBlockHash(genesisBlock, 0)
    this.blockChain = []
    this.addBlockChain([genesisBlock])
  }

  saveState () {
    if (typeof localStorage === 'undefined') {
      return false
    }

    let saveData = JSON.stringify({
      blockChain: this.blockChain,
      pool: this.pool,
      privateKey: this.privateKey,
      publicKey: this.publicKey
    })
    localStorage.setItem('blockChain', saveData)
  }

  loadState () {
    if (typeof localStorage === 'undefined') {
      return false
    }

    let newData

    try {
      newData = JSON.parse(localStorage.getItem('blockChain'))
    } catch (err) {
      newData = null
    }

    if (newData != null) {
      this.blockChain = newData.blockChain
      this.pool = newData.pool
      this.privateKey = newData.privateKey
      this.publicKey = newData.publicKey
      this.importPrivateKey(newData.privateKey)
      return true
    } else {
      return false
    }
  }
}
