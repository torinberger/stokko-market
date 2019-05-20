<template>
  <div id="auth">
    <div v-if="mode == 'login'" class="auth-tab">
      <h3>Login</h3>
      <p>Or <a @click="switchMode">Register</a></p>
    </div>
    <div v-if="mode == 'register'" class="auth-tab">
      <h3>Register</h3>
      <p>Or <a @click="switchMode">Login</a></p>
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

<style scoped>
#auth {
  width: 100%;
  height: calc(100vh - 50px);
  display: flex;
}

h3 {
  margin-top: 0;
}

.auth-tab {
  margin: auto;
  height: 80vh;
  width: 20vw;
}
</style>
