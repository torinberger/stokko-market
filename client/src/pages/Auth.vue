<template>
  <div id="auth">
    <!-- <div v-if="mode == 'login'" class="auth-tab">
      <h3>Login</h3>
      <p>Or <a @click="switchMode">Register</a></p>
    </div>
    <div v-if="mode == 'register'" class="auth-tab">
      <h3>Register</h3>
      <p>Or <a @click="switchMode">Login</a></p>
    </div> -->
    <q-card class="auth-tab">
      <q-tabs
        v-model="mode"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="login" label="Login"/>
        <q-tab name="register" label="Register" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="mode" animated>
        <q-tab-panel name="login">
          <div class="text-h6">Login</div>
          Login pls
        </q-tab-panel>

        <q-tab-panel name="register">
          <div class="text-h6">Register</div>
          <q-input v-model="name" label="Name" :rules="[ val => val && val.length > 0 || 'Please enter a name']"/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'Auth',
  data () {
    return {
      mode: this.$route.params.mode,
      name: null
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
  },
  watch: {
    mode (val) {
      history.pushState(
        { urlPath: `/#/auth/${val}` },
        '',
        `/#/auth/${val}`
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
  height: 60vh;
  width: 20vw;
}
</style>
