<template>
  <div id="app">
    <header-menu />
    <statistics />

    <b-container class="content">
      <b-row>
        <b-col size="md" cols="6">
          <keys />
        </b-col>
        <b-col size="md" cols="6">
          <blockchain-miner />
        </b-col>
      </b-row>
    </b-container>

    <blockchain-history />

    <b-container class="content">
      <transaction-pool />
    </b-container>

    <div style="background-color: #F0F0F0">
      <b-container class="content">
        <transaction-history />
      </b-container>
    </div>

    <b-container class="content">
      <peer-network />
      <peer-messages />
    </b-container>

  </div>
</template>

<script>
import BlockchainHistory from './components/blockchain/BlockchainHistory.vue'
import BlockchainMiner from './components/blockchain/BlockchainMiner.vue'
import PeerNetwork from './components/peer/PeerNetwork.vue'
import PeerMessages from './components/peer/PeerMessages.vue'
import TransactionPool from './components/transaction/TransactionPool.vue'
import TransactionHistory from './components/transaction/TransactionHistory.vue'
import HeaderMenu from './components/HeaderMenu.vue'
import Keys from './components/Keys.vue'
import Statistics from './components/Statistics.vue'

export default {
  name: 'App',
  components: {
    BlockchainHistory,
    BlockchainMiner,
    PeerNetwork,
    PeerMessages,
    TransactionPool,
    TransactionHistory,
    HeaderMenu,
    Keys,
    Statistics
  }
}
</script>

<style scoped>
  .content {
    padding: 40px 0;
  }
</style>
