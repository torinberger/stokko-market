<template>
  <div>
    <div id="auth">
      <div v-if="mode == 'login'" id="login">
        <h3>Login</h3>
        <p>Or <a @click="switchMode">Register</a></p>
      </div>
      <div v-if="mode == 'register'" id="register">
        <h3>Register</h3>
        <p>Or <a @click="switchMode">Login</a></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Auth',
  data () {
    return {
      mode: this.$route.params.mode
    }
  },
  created () {
    if (this.mode !== 'login' && this.mode !== 'register') {
      this.mode = 'login'
    }

    history.pushState(
      { urlPath: `/#/auth/${this.mode}` },
      '',
      `/#/auth/${this.mode}`
    )
  },
  methods: {
    switchMode () {
      this.mode = this.mode === 'login' ? this.mode = 'register' : this.mode = 'login'
      history.pushState(
        { urlPath: `/#/auth/${this.mode}` },
        '',
        `/#/auth/${this.mode}`
      )
    }
  }
}
</script>

<style>
</style>
