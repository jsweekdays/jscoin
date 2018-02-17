import BlockchainService from '../BlockchainService'

import {
  EVENT_WORKER_INIT,
  EVENT_WORKER_START,
  EVENT_WORKER_ERROR,
  EVENT_WORKER_ATTEMPT,
  EVENT_WORKER_SUCCESS
} from './events'

const ATTEMPT_LIMIT = 1000

const blockchain = new BlockchainService()

onmessage = function (e) {
  switch (e.data.type) {
    case EVENT_WORKER_INIT:
      Object.keys(e.data).forEach((key) => {
        blockchain[key] = e.data[key]
      })

      blockchain.importPrivateKey(e.data.privateKey)
      break

    case EVENT_WORKER_START:
      if (!blockchain.canGenerateBlock()) {
        postMessage({
          type: EVENT_WORKER_ERROR
        })
        return
      }

      blockchain.startBlockGeneration()

      let attemps = 0
      let block

      while (blockchain.blockGeneration && (attemps < ATTEMPT_LIMIT)) {
        block = blockchain.generateBlock()
        attemps++
        postMessage({
          type: EVENT_WORKER_ATTEMPT,
          payload: { attemps }
        })
      }

      postMessage({
        type: EVENT_WORKER_SUCCESS,
        payload: { block }
      })

      break
  }
}
