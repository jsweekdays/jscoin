<template>
  <div>
    <h4>
      Last {{ limit }} peer messages
      <b-button size="sm" :disabled="!connected" variant="secondary" @click="sendMessage()">Send debug message</b-button>
    </h4>
    <b-table
      v-bind:items="lastMessages"
      show-empty
      empty-text="There's no saved messages"
      fixed
      caption-top>
      <template slot="data" slot-scope="data">
        <div class="peer-message-data">{{data.value}}</div>
      </template>
    </b-table>
  </div>
</template>

<script>
import { EVENT_SELF_CONNECTED, EVENT_PEER_MESSAGE } from '../../services/PeerNetworkService/events'

const LIMIT_MESSAGE = 5

export default {
  name: 'PeerMessages',
  created: function () {
    this.$peer.on(EVENT_SELF_CONNECTED, () => {
      this.$set(this, 'connected', true)
    })

    this.$peer.on(EVENT_PEER_MESSAGE, payload => {
      const lastMessages = this.lastMessages.slice()

      try {
        const {type, data} = JSON.parse(payload)

        if (type) {
          lastMessages.unshift({
            type,
            data: JSON.stringify(data)
          })
        } else {
          lastMessages.unshift({
            type: 'unknown'
          })
        }
      } catch (error) {
        lastMessages.unshift({
          type: 'error',
          data: error.toString()
        })
      }

      while (lastMessages.length > LIMIT_MESSAGE) {
        lastMessages.shift()
      }

      this.$set(this, 'lastMessages', lastMessages)
    })
  },
  data () {
    return {
      connected: false,
      lastMessages: [],
      limit: LIMIT_MESSAGE
    }
  },
  methods: {
    sendMessage () {
      this.$peer.broadcast(
        JSON.stringify({
          type: 'debug',
          data: 'Hello from peer ID: ' + this.$peer.getPeerID()
        })
      )
    }
  }
}
</script>

<style scoped>
  .peer-message-data {
    word-wrap: break-word;
  }
</style>
