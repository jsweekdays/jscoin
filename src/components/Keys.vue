<template>
  <div class="statictics">
    <h3>Keys block</h3>
    <b-row class="statictics-row">
      <b-col sm="3"><label :for="publicKey">Public Key:</label></b-col>
      <b-col sm="9"><b-form-input :id="publicKey" v-model="publicKey" type="text" /></b-col>
    </b-row>
    <b-row class="statictics-row">
      <b-col sm="3"><label :for="publicKey">Private Key:</label></b-col>
      <b-col sm="9"><b-form-input :id="privateKey" v-model="privateKey" type="text" /></b-col>
    </b-row>

    <b-row class="statictics-row">
      <b-col offset-sm="3" sm="9">
        <b-button size="sm" @click="importKey">Import private key</b-button>
        <b-button size="sm" @click="generateKeys">Generate keys</b-button>
      </b-col>
    </b-row>

    <b-row class="statictics-row">
      <b-col offset-sm="3" sm="9">
        <b-button size="sm" @click="importKeyTest1">Test key 1</b-button>
        <b-button size="sm" @click="importKeyTest2">Test key 2</b-button>
        <b-button size="sm" @click="importKeyTest3">Test key 3</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { EVENT_KEYS_UPDATE } from '../services/BlockchainService'

export default {
  name: 'Keys',
  created: function () {
    this.$set(this, 'privateKey', this.$blockchain.privateKey)
    this.$set(this, 'publicKey', this.$blockchain.publicKey)

    this.$blockchain.on(EVENT_KEYS_UPDATE, () => {
      if (this.$blockchain.privateKey !== this.privateKey) {
        this.$set(this, 'privateKey', this.$blockchain.privateKey)
        this.$set(this, 'publicKey', this.$blockchain.publicKey)
      }
    })
  },
  methods: {
    importKey () {
      this.$blockchain.importPrivateKey(this.privateKey)
    },
    generateKeys () {
      this.$blockchain.generateKeyPair()
    },
    importKeyTest1 () {
      this.$blockchain.importPrivateKey('MIIBOwIBAAJBAJWMA2f+uaZfvl5Q+JInI5uKAbsM6m5vSzwQRjpOh8/uDIVZ0VwlJjCvOsbdePit3CUMwqiO6r2yAJ4zGgY+lWMCAwEAAQJAWYuO9pRWAcNOsBb34DvDXH0UcDZZoWrOt9Ze1sbzF5Nc65xOoJeqpiTYu1OclyC9pGTuGCTZ6UcV5hAeSqcMsQIhANroTXDpZPfwXoUaSd4h3tvxjjwOsWB9YL0+aFod0fJ1AiEAruMDQVMfTM8iOstGRjxmGI2OPpltvOMClKNTDUk9PXcCIDRlAZQS6M3HRHhLMH7wUG0IRejuA1p659qjw0o+dO+5AiEAkvwXG0sqTlr0kOeRq6xNvqsSd0hqc8tzuss+HTeF8ecCIQDB8+gL6ubKkmz6Be3KhHuVtAhHVpcETvgIbbjv2mQEJA==')
    },
    importKeyTest2 () {
      this.$blockchain.importPrivateKey('MIIBOwIBAAJBAOulXQoQd9SIAxpkTvaVbCHpfjAs8euX5KrhDtH6c8Ca5C9pWcjjMNpe6HorGIruh2JTvuIvl2lMg15gRje/XwECAwEAAQJAcASR7+DYNe3aG8enSczKNGy8kcYr0mTITPrjgqneMKYHVes/TjnMCiUaZjMPnhRN5gZXj5ZOns3PuueU9O0sYQIhAPres2GsW+XKadcltxGpN0ek/Ut2zTMYQHWGx4hA7+w1AiEA8Hb3K9GUAuYjeWYXhMblN2eUoDylT7cNaesxNLcsyR0CIQCkHDtMkewsDpXeYJW5v/ChtZTdYQIrgpnoSBsPTyukYQIgALn7STCa599WIBnE3GvVaXNwqYNFZJZC/hztyyD6i6kCIQCQex7e+zx9T4rTerQzcn2+Su7YJF5oFx0I3hPS7EdJCA==')
    },
    importKeyTest3 () {
      this.$blockchain.importPrivateKey('MIIBPAIBAAJBAN+wtGoL9BESrdw5qm7CNF1whttFUIhbV1XVzDFVFkcB36sLBzQ2h5NJB8wy+mVFrgFzwzwskQAsQmqdg/bx4q8CAwEAAQJBAMbw8yO1idV9VV8dcjSbR9MqduWgmeULx3qxcK8XS37NxAHIEI/97ull+/WIQ+/4yGU4LLJThlIHpOVbmokEh0ECIQD1e2sJE61WJxHMTFPtSZBlB/AsK56ilteOPyuITbdP/wIhAOlGQwA57dbZ3al7DniVLsLY/f2Q7UFfPybjTD8NHm1RAiA6S1uopSaVfeOpGzsW71A93bu4EYezXpTDr9aboLD2awIhAK1hQY87fyD/URcUlU7eYqEDstPyEcVSy5dVvWfnkkPhAiEA1VbiBh2f+AaM55HAB76QgCik9O6KlC2uY1tDfIkAiJo=')
    }
  },
  data () {
    return {
      publicKey: '',
      privateKey: ''
    }
  }
}
</script>

<style scoped>
  .statictics {
    background: #F7F7F7;
    padding: 15px;
  }
  .statictics-row {
    padding: 10px 0;
  }
  .statictics-row label {
    line-height: 38px;
  }
</style>
