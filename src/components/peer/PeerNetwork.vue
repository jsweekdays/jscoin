<template>
  <div>
    <h4>
      Peer connections
      <b-button size="sm" variant="outline-secondary" disabled>My ID: {{ peerID }}</b-button>
    </h4>
    <b-table
      caption-top
      fixed
      show-empty
      v-bind:items="peers"
      empty-text="There's no active peer connections" />
  </div>
</template>

<script>

import {
  EVENT_SELF_CONNECTED,
  EVENT_PEER_CONNECTED,
  EVENT_PEER_DISCONNECTED
} from '../../services/PeerNetworkService/events'

export default {
  name: 'PeerNetwork',
  created: function () {
    this.$peer.on(EVENT_SELF_CONNECTED, () => {
      this.$set(this, 'peers', this.$peer.getPeers())
      this.$set(this, 'peerID', this.$peer.getPeerID())
    })
    this.$peer.on(EVENT_PEER_CONNECTED, () => {
      this.$set(this, 'peers', this.$peer.getPeers())
    })
    this.$peer.on(EVENT_PEER_DISCONNECTED, () => {
      this.$set(this, 'peers', this.$peer.getPeers())
    })
  },
  data () {
    return {
      peerID: 'not set',
      peers: []
    }
  }
}
</script>
