<template>
  <div>
    <b-navbar type="light" variant="light">
      <b-container>
        <div class="header-left">
          Connection status:
          <span v-if="connected">online</span>
          <span v-if="!connected">offline</span>
        </div>
        <div class="header-right">
          <b-button size="sm" variant="outline-primary" @click="genesis">Start from genesis</b-button>
          <b-button size="sm" variant="outline-primary" @click="loadTestBlockChain">Load test blockchain</b-button>
        </div>
      </b-container>
    </b-navbar>

    <b-modal hide-footer id="modal-create" ref="modal" title="Create new transaction">
      <transaction-create :on-submit="submitModal" :on-cancel="cancelModal" />
    </b-modal>

    <b-container class="menu-container">
      <b-row>
        <b-col class="logoCol">
          <img v-bind:src="logo" />
        </b-col>
        <b-col>
          <h1>JS Coin</h1>
          <div>Experimental project</div>
        </b-col>
        <b-col>
          <div style="text-align: right">
            <div>Balance: <strong>{{ balance }}</strong> JS COIN</div>
            <b-btn v-b-modal.modal-create>Create transaction</b-btn>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { EVENT_BALANCE, EVENT_KEYS_UPDATE } from '../services/BlockchainService'
import { EVENT_SELF_CONNECTED, EVENT_SELF_DISCONNECTED } from '../services/PeerNetworkService/events'

import TransactionCreate from './transaction/TransactionCreate.vue'
import logo from '../assets/logo.png'

export default {
  name: 'HeaderMenu',
  created: function () {
    this.$blockchain.on(EVENT_KEYS_UPDATE, () => {
      this.$set(this, 'balance', this.$blockchain.getClientBalance())
    })
    this.$blockchain.on(EVENT_BALANCE, () => {
      this.$set(this, 'balance', this.$blockchain.getClientBalance())
    })

    this.$peer.on(EVENT_SELF_CONNECTED, () => {
      this.$set(this, 'connected', true)
    })

    this.$peer.on(EVENT_SELF_DISCONNECTED, () => {
      this.$set(this, 'connected', false)
    })
  },
  components: {
    TransactionCreate
  },
  methods: {
    submitModal (receiver, amount) {
      this.$refs.modal.hide()
    },
    cancelModal () {
      this.$refs.modal.hide()
    },
    genesis () {
      this.$blockchain.genesis()
    },
    loadTestBlockChain () {
      this.$blockchain.addTestBlockChain()
    }
  },
  data () {
    return {
      logo,
      connected: false,
      balance: this.$blockchain.getClientBalance()
    }
  }
}
</script>

<style scoped>
  .header-left {
    flex: 0 0 50%;
  }
  .header-right {
    flex: 0 0 50%;
    text-align: right;
  }
  .menu-container {
    padding: 30px 15px
  }
  .logoCol {
    padding-right: 0;
    flex: 0 0 100px;
  }
</style>
