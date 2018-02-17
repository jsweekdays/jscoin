<template>
  <div class="miner">
    <h2>Miner</h2>
    <b-button
      :disabled="!canMine"
      :variant="canMine ? 'success' : 'outline-secondary'"
      @click="mineBlock">Mine block</b-button>

    <div>isRunning: {{ isRunning }}</div>
    <div>attemps: {{ attemps }}</div>
    <div class="miner-result">
      lastBlock: {{ JSON.stringify(lastBlock) }}
    </div>
    <div>result: {{ result }}</div>
  </div>
</template>

<script>
import {
  EVENT_MINER_START,
  EVENT_MINER_ATTEMPT,
  EVENT_MINER_SUCCESS,
  EVENT_TRANSACTIONS_UPDATE
} from '../../services/BlockchainService'

import {
  EVENT_WORKER_INIT,
  EVENT_WORKER_START
} from '../../services/WorkerService/events'

export default {
  name: 'BlockchainMiner',
  created: function () {
    this.$blockchain.on(EVENT_TRANSACTIONS_UPDATE, transactions => {
      this.$set(this, 'canMine', transactions && transactions.length > 0)
    })

    this.$blockchain.on(EVENT_MINER_START, () => {
      this.$set(this, 'isRunning', true)
    })

    this.$blockchain.on(EVENT_MINER_ATTEMPT, ({ attemps }) => {
      this.$set(this, 'attemps', attemps)
    })

    this.$blockchain.on(EVENT_MINER_SUCCESS, ({ block }) => {
      this.$set(this, 'isRunning', false)
      this.$set(this, 'lastBlock', block)
      this.result = this.$blockchain.addBlock(block)
    })
  },
  methods: {
    mineBlock () {
      // @TODO: move to blockchain plugin
      this.$worker.postMessage({
        type: EVENT_WORKER_INIT,
        blockChain: this.$blockchain.blockChain,
        pool: this.$blockchain.pool,
        privateKey: this.$blockchain.privateKey,
        publicKey: this.$blockchain.publicKey,
        level: this.$blockchain.level,
        reward: this.$blockchain.reward,
        blockSize: this.$blockchain.blockSize
      })

      this.$worker.postMessage({
        type: EVENT_WORKER_START
      })

      this.$blockchain.removeFirstTransactions()
    }
  },
  data () {
    return {
      canMine: this.$blockchain.getTransactions().length > 0,
      isRunning: false,
      attemps: 0,
      hasError: false,
      lastBlock: null,
      result: ''
    }
  }
}
</script>

<style scoped>
  .miner {
    background: #F7F7F7;
    padding: 15px;
  }
  .miner-result {
    word-wrap: break-word;
  }
</style>
