<template>
  <div class="container">
    <div>
      <h2>
        My transaction pool
        <b-button size="sm" variant="secondary" @click="clearPool()">Clear transaction pool</b-button>
      </h2>

      <b-table
        v-bind:items="transactionPage"
        striped
        fixed
        show-empty
        empty-text="Transaction pool is empty">
        <template slot="from" slot-scope="data">
          <a class="template-link">{{data.value}}</a>
        </template>
        <template slot="to" slot-scope="data">
          <a class="template-link">{{data.value}}</a>
        </template>
        <template slot="hash" slot-scope="data">
          <a class="template-link">{{data.value}}</a>
        </template>
        <template slot="signature" slot-scope="data">
          <a class="template-link">{{data.value}}</a>
        </template>
        <template slot="_showDetails" slot-scope="row">
          <b-button size="sm" @click.stop="row.toggleDetails" class="mr-2">
           {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
          </b-button>
        </template>
        <template slot="row-details" slot-scope="row">
          <b-card>
            <b-row v-for="(value, key) in row.item" :key="key" v-if="key.indexOf('_') !== 0">
              <b>{{ key }}:</b> {{ value}}
            </b-row>
          </b-card>
        </template>
      </b-table>
      <b-pagination
        v-bind:total-rows="totalRows"
        v-bind:per-page="perPage"
        v-model="currentPage" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { EVENT_TRANSACTIONS_UPDATE } from '../../services/BlockchainService'

const withoutShowDetails = (transactions) => (
  transactions.map((transaction) => ({
    ...transaction,
    _showDetails: false
  }))
)

export default {
  name: 'BlockHistory',
  created: function () {
    this.$blockchain.on(EVENT_TRANSACTIONS_UPDATE, transactions => (
      this.$set(this, 'transactions', withoutShowDetails(transactions))
    ))
  },
  methods: {
    clearPool () {
      this.$blockchain.clearPool()
    }
  },
  data () {
    return {
      transactions: withoutShowDetails(this.$blockchain.getTransactions()),
      currentPage: 1,
      perPage: 5
    }
  },
  computed: {
    totalRows () {
      return this.transactions.length
    },
    transactionPage () {
      const start = (this.currentPage - 1) * this.perPage
      return this.transactions
        .slice(start, start + this.perPage)
        .map((transaction) => ({
          ...transaction,
          time: moment(transaction.time).format('Do of MMM  hh:mm:ss')
        }))
    }
  }
}
</script>

<style scoped>
  .template-link {
    text-overflow: ellipsis;
    overflow: hidden;
    display: block
  }
</style>
