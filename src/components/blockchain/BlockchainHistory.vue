<template>
  <div class="history">
    <b-container>
      <h2>Blockchain history</h2>
      <div class="card-deck" id="cardDeck">
        <div class="card history-block" v-for="(block, key) in blocks" v-bind:key="key" @click="openModal(block)" v-b-modal.modalBlock>
          <div class="card-header">
            <b-badge>Block #{{ block.N }}</b-badge>
            <b-badge>{{ block.time }}</b-badge>
          </div>
          <div class="card-body">
            <div class="card-text" v-for="(transaction, key) in block.transactions" v-bind:key="key">
              <div class="transaction transaction--small">
                <div class="transaction-title transaction-title--wide">Transaction #{{ key + 1 }}</div>
                <div class="transaction-item">
                  <span class="transaction-key">amount: </span>
                  <span class="transaction-value">{{ transaction.amount }}</span>
                </div>
                <div class="transaction-item">
                  <span class="transaction-key">from: </span>
                  <span class="transaction-value">{{ transaction.from }}</span>
                </div>
                <div class="transaction-item">
                  <span class="transaction-key">to: </span>
                  <span class="transaction-value">{{ transaction.to }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <b-modal size="lg" id="modalBlock" v-bind:title="'Block # ' + ((modalBlock == null) ? '' : modalBlock.N)" ok-only>
        <div v-if="modalBlock == null">
          Nothing show
        </div>
        <div v-else>
          <h4>Info</h4>
          <div class="transaction">
            <div v-for="(value, key) in getModalBlock().otherInfo" v-bind:key="key" class="transaction-item">
              <span class="transaction-key">{{ key }}:</span>
              <span class="transaction-value">{{ value }}</span>
            </div>
          </div>

          <h4>Transactions</h4>
          <div v-for="(transaction, key) in getModalBlock().transactions" v-bind:key="key" class="transaction">
            <div class="transaction-title">Transaction #{{ key + 1 }}</div>
            <div v-for="(value, key) in transaction" v-bind:key="key" class="transaction-item">
              <span class="transaction-key">{{ key }}:</span>
              <span class="transaction-value">{{ value }}</span>
            </div>
          </div>
        </div>
      </b-modal>
    </b-container>
  </div>
</template>

<script>

import moment from 'moment'

import { EVENT_BLOCKCHAIN_UPDATE } from '../../services/BlockchainService'

const withFormattedTime = (blockchain) => (
  blockchain.map((block) => ({
    ...block,
    time: moment(block.time).format('Do of MMM hh:mm:ss')
  }))
)
export default {
  name: 'BlockchainHistory',
  created: function () {
    this.$blockchain.on(EVENT_BLOCKCHAIN_UPDATE, blockchain => {
      this.$set(this, 'blocks', withFormattedTime(blockchain))
    })
  },
  updated: function () {
    const container = this.$el.querySelector('#cardDeck')
    container.scrollLeft = container.scrollWidth
  },
  mounted: function () {
    const container = this.$el.querySelector('#cardDeck')
    container.scrollLeft = container.scrollWidth
  },
  methods: {
    openModal (block) {
      this.modalBlock = block
    },
    getModalBlock () {
      const otherInfo = {}
      if (this.modalBlock == null) {
        return {
          otherInfo: otherInfo,
          transaction: []
        }
      } else {
        Object.keys(this.modalBlock).forEach((key) => {
          // @TODO: extract magic constant
          if (key !== 'transactions') {
            otherInfo[key] = this.modalBlock[key]
          }
        })

        return {
          otherInfo: otherInfo,
          transactions: this.modalBlock.transactions
        }
      }
    }
  },
  data () {
    return {
      blocks: withFormattedTime(this.$blockchain.getBlockChain()),
      modalBlock: null
    }
  }
}
</script>

<style scoped>

.history {
  background: #F7F7F7;
  padding: 30px 0 50px 0;
}

.history-block:hover {
  cursor: pointer;
  border-color: rgba(0, 0, 0, 0.25);
}

.history-block:hover .card-header {
  background: rgba(0, 0, 0, 0.1);
}
.history-block:hover .card-body {
  background: rgba(0, 0, 0, 0.05);
}
.history .card-header {
  padding: 0.5rem 1rem;
}
.history .card-body {
  padding: 1rem;
}
.transaction {
  font-size: 15px;
  line-height: 17px;
}
.transaction-item {
  padding: 4px 0;
}
.transaction.transaction--small {
  font-size: 13px;
  line-height: 15px;
}
.transaction-title {
  background: #F0F0F0;
  margin: 5px 0;
  padding: 5px;
}
.transaction-title.transaction-title--wide {
  margin: 5px -5px;
}

.transaction-key {
  float: left;
  font-weight: bold;
  padding-right: 3px;
}
.transaction-value {
  word-wrap: break-word;
}

.card-deck .card {
  min-width: 23%;
  max-width: 23%;
}
.card-deck {
  overflow-x: scroll;
  width: 100%;
  flex-flow: row nowrap;
}
.card-text > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  width: 43%;
}
.card-text > span:last-child {
  width: 10%;
}
</style>
