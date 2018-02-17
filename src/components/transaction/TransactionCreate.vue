<template>
  <form v-on:submit.prevent="submit">
    <div class="form-group">
      <label for="receiver">Recipient address</label>
      <input type="text" v-model="receiver" class="form-control" id="receiver" aria-describedby="idHelp" placeholder="Enter recipient address" required>
      <small id="idHelp" class="form-text text-muted">Specify the recipient's address to create the transaction.</small>

      <button type="button" v-on:click="testKey1" class="btn btn-secondary">Test key 1</button>
      <button type="button" v-on:click="testKey2" class="btn btn-secondary">Test key 2</button>
      <button type="button" v-on:click="testKey3" class="btn btn-secondary">Test key 3</button>
    </div>
    <div class="form-group">
      <label for="amount">Count JS COIN</label>
      <input type="number" v-model="amount" class="form-control" id="amount" required>
    </div>
    <div class="text-right">
      <button type="submit" class="btn btn-primary">Create</button>
      <button type="button" v-on:click="cancel" class="btn btn-secondary">Cancel</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'TransactionCreate',
  props: ['onSubmit', 'onCancel'],
  methods: {
    cancel () {
      this.onCancel()
    },
    submit () {
      // @TODO: refactor
      if (this.receiver && this.amount) {
        const transaction = this.$blockchain.createClientTransaction(this.receiver, this.amount)
        const error = this.$blockchain.addTransactionToPool(transaction)

        if (error !== true) {
          alert(JSON.stringify(error))
        } else {
          this.$peer.broadcast(
            JSON.stringify({
              type: 'transaction',
              data: transaction
            })
          )
        }

        this.onSubmit()
      }
    },
    testKey1 () {
      this.receiver = 'MEgCQQCVjANn/rmmX75eUPiSJyObigG7DOpub0s8EEY6TofP7gyFWdFcJSYwrzrG3Xj4rdwlDMKojuq9sgCeMxoGPpVjAgMBAAE='
    },
    testKey2 () {
      this.receiver = 'MEgCQQDrpV0KEHfUiAMaZE72lWwh6X4wLPHrl+Sq4Q7R+nPAmuQvaVnI4zDaXuh6KxiK7odiU77iL5dpTINeYEY3v18BAgMBAAE='
    },
    testKey3 () {
      this.receiver = 'MEgCQQDfsLRqC/QREq3cOapuwjRdcIbbRVCIW1dV1cwxVRZHAd+rCwc0NoeTSQfMMvplRa4Bc8M8LJEALEJqnYP28eKvAgMBAAE='
    }
  },
  data () {
    return {
      receiver: '',
      amount: 0
    }
  }
}
</script>

<style scoped>

</style>
