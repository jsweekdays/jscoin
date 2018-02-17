<template>
  <div>
    <h2>My transaction history</h2>
    <div v-if="transactionHistory.length" class='history'>
      <div
        v-for="(transaction, key) in transactionHistory"
        v-bind:key="key"
        v-bind:id="'p-' + key"
        v-bind:class="{ 'transaction': true, [transaction.type]: true }"
      >
        <b-popover
          v-bind:target="'p-' + key"
          v-bind:key="key"
          triggers="hover focus">
          <dl v-for="(value, key) in transaction" v-bind:key="key">
            <dt>{{ key }}</dt>
            <dd>{{ value }}</dd>
          </dl>
        </b-popover>
        <div class='type'>{{ transaction.type }}</div>
        <div class='amount'>{{ transaction.amount }}</div>
        <div class='wallet'>{{ transaction.wallet }}</div>
      </div>
    </div>
    <div v-else class='history'>
      Transaction history is empty
    </div>
  </div>
</template>

<script>
import {
  EVENT_BLOCKCHAIN_UPDATE,
  EVENT_KEYS_UPDATE
} from '../../services/BlockchainService'

const getHistory = (key, transactions) => transactions
  .filter(transaction => transaction.from === key || transaction.to === key)
  .map(transaction => {
    let type
    if (transaction.from === 'reward') {
      type = 'reward'
    } else if (transaction.to === key) {
      type = 'income'
    } else {
      type = 'outcome'
    }

    return {
      type,
      ...transaction
    }
  })

export default {
  name: 'TransactionHistory',

  data () {
    return {
      transactionHistory: []
    }
  },

  created: function () {
    this.refreshHistory()

    this.$blockchain.on(EVENT_BLOCKCHAIN_UPDATE, data => {
      this.refreshHistory()
    })

    this.$blockchain.on(EVENT_KEYS_UPDATE, data => {
      this.refreshHistory()
    })
  },

  methods: {
    refreshHistory () {
      this.transactionHistory = getHistory(
        this.$blockchain.publicKey,
        this.$blockchain.getAllTransactions()
      )
    }

  }
}
</script>

<style scoped>
.history {
  display: flex;
  flex-flow: row wrap;
}

.transaction {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin: 10px;
  width: 200px;
  height: 200px;
  border-radius: 3px;
  cursor: pointer;
}

.outcome {
  background-color: hsla(0, 85%, 35%, 0.4);
}

.income {
  background-color: hsl(120, 34%, 71%);
}

.reward {
  background-color: wheat;
}

.amount {
  font-size: 60px;
  color: hsl(0, 0%, 10%);
}

.type {
  font-size: 14px;
  color: hsl(0, 0%, 30%);
}

.wallet {
  font-size: 14px;
  color: hsl(0, 0%, 30%);
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
