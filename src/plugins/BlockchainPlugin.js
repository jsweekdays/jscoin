import WorkerService from '../services/WorkerService'
import PeerNetworkService from '../services/PeerNetworkService'

import BlockchainService, {
  EVENT_BLOCKCHAIN_UPDATE,
  EVENT_MINER_START,
  EVENT_MINER_ATTEMPT,
  EVENT_MINER_ERROR,
  EVENT_MINER_SUCCESS
} from '../services/BlockchainService'

import {
  EVENT_PEER_MESSAGE
} from '../services/PeerNetworkService/events'

import {
  EVENT_WORKER_START,
  EVENT_WORKER_ATTEMPT,
  EVENT_WORKER_ERROR,
  EVENT_WORKER_SUCCESS
} from '../services/WorkerService/events'

const workerMessages = {
  [EVENT_WORKER_START]: EVENT_MINER_START,
  [EVENT_WORKER_ATTEMPT]: EVENT_MINER_ATTEMPT,
  [EVENT_WORKER_ERROR]: EVENT_MINER_ERROR,
  [EVENT_WORKER_SUCCESS]: EVENT_MINER_SUCCESS
}
const types = Object.keys(workerMessages)

const BlockchainPlugin = {
  install: function (Vue, options = {}) {
    const peer = new PeerNetworkService(options.peer || {})
    const blockchain = new BlockchainService()
    const worker = new WorkerService()

    worker.addEventListener('message', (event) => {
      const {data: {type, payload}} = event
      if (types.includes(type)) {
        blockchain.emit(workerMessages[type], payload)
      }
    })

    blockchain.on(EVENT_BLOCKCHAIN_UPDATE, (data) => {
      peer.broadcast(
        JSON.stringify({
          type: 'blockChain',
          data
        })
      )
    })

    peer.on(EVENT_PEER_MESSAGE, payload => {
      try {
        const {type, data} = JSON.parse(payload)
        switch (type) {
          // @TODO: extract magic constant
          case 'blockChain':
            blockchain.addBlockChain(data)
            break

          // @TODO: extract magic constant
          case 'transaction':
            blockchain.addTransactionToPool(data)
            break
        }
      } catch (e) {
        console.error(e)
      }
    })

    // blockchain.on(EVENT_MINER_SUCCESS, ({ block }) => (
    //   blockchain.addBlock(block)
    // ))

    Vue.prototype.$peer = peer
    Vue.prototype.$blockchain = blockchain
    Vue.prototype.$worker = worker
  }
}

export default BlockchainPlugin
