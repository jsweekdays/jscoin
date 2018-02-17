<template>
  <div class="statictics">
    <div class="container">
      <b-row>
        <b-col cols="7">
          <div class="statictic-title">Blockchain statictics</div>
          <b-badge class="statictic-item" variant="light">coin mass: <span>{{ blockchainBalance }}</span></b-badge>
          <b-badge class="statictic-item" variant="light">blocks: <span>{{ blockchainBlocksCount }}</span></b-badge>
          <b-badge class="statictic-item" variant="light">transactions: <span>{{ blockchainTransactionCount }}</span></b-badge>
          <b-badge class="statictic-item" variant="light">active keys: <span>{{ blockchainPeersCount }}</span></b-badge>
        </b-col>
        <b-col cols="3">
          <div class="statictic-title">Pool statictics</div>
          <b-badge class="statictic-item" variant="light">transactions in pool: <span>{{ poolTransactions }}</span></b-badge>
        </b-col>
        <b-col cols="2">
          <div class="statictic-title">Peer statictics</div>
          <b-badge class="statictic-item" variant="light">connections: <span>{{ peerConnections }}</span></b-badge>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import {
  EVENT_BLOCKCHAIN_UPDATE,
  EVENT_TRANSACTIONS_UPDATE
} from '../services/BlockchainService'

import {
  EVENT_SELF_CONNECTED,
  EVENT_PEER_CONNECTED,
  EVENT_PEER_DISCONNECTED
} from '../services/PeerNetworkService/events'

// @TODO: extract to service
const calcalucateBlockchain = (blockchain) => {
  const {
    blockchainBalance,
    blockchainTransactionCount,
    blockchainPeers
  } = blockchain.reduce((accumulator, block) => {
    accumulator.blockchainTransactionCount += block.transactions.length

    block.transactions.forEach((transaction) => {
      if (transaction.from === 'reward') {
        accumulator.blockchainBalance += transaction.amount
      }

      if (!accumulator.blockchainPeers.includes(transaction.from) && transaction.from !== 'reward') {
        accumulator.blockchainPeers.push(transaction.from)
      }

      if (!accumulator.blockchainPeers.includes(transaction.to)) {
        accumulator.blockchainPeers.push(transaction.to)
      }
    })

    return accumulator
  }, {
    blockchainBalance: 0,
    blockchainTransactionCount: 0,
    blockchainPeers: []
  })

  return {
    blockchainBalance,
    blockchainTransactionCount,
    blockchainPeersCount: blockchainPeers.length,
    blockchainBlocksCount: blockchain.length
  }
}

export default {
  name: 'Statistics',
  created: function () {
    this.$blockchain.on(EVENT_BLOCKCHAIN_UPDATE, blockchain => {
      const { blockchainBalance, blockchainTransactionCount, blockchainPeersCount, blockchainBlocksCount } = calcalucateBlockchain(blockchain)
      this.$set(this, 'blockchainBalance', blockchainBalance)
      this.$set(this, 'blockchainTransactionCount', blockchainTransactionCount)
      this.$set(this, 'blockchainPeersCount', blockchainPeersCount)
      this.$set(this, 'blockchainBlocksCount', blockchainBlocksCount)
    })

    this.$blockchain.on(EVENT_TRANSACTIONS_UPDATE, transactions => {
      this.$set(this, 'poolTransactions', transactions.length)
    })

    this.$peer.on(EVENT_SELF_CONNECTED, () => {
      this.$set(this, 'peerConnections', this.$peer.getPeers().length)
    })

    this.$peer.on(EVENT_PEER_CONNECTED, () => {
      this.$set(this, 'peerConnections', this.$peer.getPeers().length)
    })

    this.$peer.on(EVENT_PEER_DISCONNECTED, () => {
      this.$set(this, 'peerConnections', this.$peer.getPeers().length)
    })
  },
  data () {
    const { blockchainBalance, blockchainTransactionCount, blockchainPeersCount, blockchainBlocksCount } = calcalucateBlockchain(this.$blockchain.getBlockChain())

    return {
      blockchainBalance,
      blockchainTransactionCount,
      blockchainPeersCount,
      blockchainBlocksCount,
      poolTransactions: this.$blockchain.getTransactions().length,
      peerConnections: 'not set'
    }
  }
}
</script>

<style scoped>
  .statictics {
    background: #f0f0f0;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding: 20px 0;
    margin-bottom: 20px;
  }

  .statictic-title {
    margin: 0 0 5px 5px;
    font-size: 16px;
    font-weight: bold;
  }

  .statictic-item {
    font-size: 14px;
    font-weight: normal;
    padding: 10px;
    text-transform: capitalize;
  }

  .statictic-item span {
    font-size: 16px;
    font-weight: bold;
  }
</style>
