import Random from 'random-js'

let random = Random(Random.engines.mt19937().autoSeed())

let NonceGenerator = {
  randomNonce: function () {
    return random.integer(-parseInt(Number.MAX_SAFE_INTEGER / 2), parseInt(Number.MAX_SAFE_INTEGER / 2))
  }
}

export default NonceGenerator
