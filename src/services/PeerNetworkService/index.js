/* eslint handle-callback-err: 0 */

import Peer from 'peerjs'
import EventEmitter from 'wolfy87-eventemitter'

import {
  EVENT_SELF_OPEN,
  EVENT_SELF_CONNECTED,
  EVENT_SELF_DISCONNECTED,
  EVENT_SELF_CLOSE,
  EVENT_PEER_CONNECTED,
  EVENT_PEER_DISCONNECTED,
  EVENT_PEER_MESSAGE
} from './events'

const getPeerIDs = (trackerUrl) => (
  fetch(trackerUrl)
    .then(res => res.json())
    .catch(err => Promise.resolve([]))
)

const sendPeerID = (trackerUrl, peerID) => {
  return fetch(trackerUrl, {
    method: 'POST',
    body: JSON.stringify({ peerID }),
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    }
  })
}

class PeerNetwork extends EventEmitter {
  constructor (options) {
    super()

    const { key, trackerUrl } = options

    this.peers = []
    this.peer = new Peer({ key })

    const processConnection = (connection) => () => {
      this.peers.push(connection)

      connection.on('data', (data) => {
        this.emit(EVENT_PEER_MESSAGE, data)
      })

      connection.on('close', (data) => {
        this.peers = this.peers.filter((peer) => peer !== connection)
        this.emit(EVENT_PEER_DISCONNECTED, connection.peer)
      })

      this.emit(EVENT_PEER_CONNECTED, connection.peer)
    }
    this.peer.on('open', (peerID) => {
      this.emit(EVENT_SELF_OPEN)

      getPeerIDs(trackerUrl)
        .then((peerIDs) => peerIDs.filter((peerID) => this.peer.id !== peerID))
        .then((peerIDs) => peerIDs.map((peerID) => this.peer.connect(peerID)))
        .then((peers) => {
          peers.forEach((peer) => (
            peer.on('open', processConnection(peer))
          ))
          this.emit(EVENT_SELF_CONNECTED)
        })
        .then(sendPeerID(trackerUrl, peerID))
    })

    this.peer.on('connection', (connection) => {
      processConnection(connection)()
    })

    this.peer.on('error', (error) => {
      if (error.type === 'disconnected') {
        this.emit(EVENT_SELF_DISCONNECTED)
      }
      console.warn(error)
    })

    this.peer.on('close', () => (
      this.emit(EVENT_SELF_CLOSE)
    ))
  }

  getPeerID () {
    return this.peer && this.peer.id
  }

  getPeers () {
    return this.peers.map((peer) => ({
      id: peer.peer,
      client: peer._peerBrowser
    }))
  }

  broadcast (payload) {
    return Promise.all(
      this.peers.map((peer) =>
        new Promise((resolve) => {
          peer.send(payload) &&
          resolve()
        })
      )
    )
  }
}

export default PeerNetwork
