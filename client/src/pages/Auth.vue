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
          <q-form
            @submit="login"
          >
            <q-input v-model="username" label="Username" :rules="[ val => val && val.length > 0 || 'Please enter a username']"/>
            <q-input v-model="password" type="password" label="Password" :rules="[ val => val && val.length > 0 || 'Please enter a password']"/>
            <q-btn label="Submit" type="submit" color="primary"/>
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="register">
          <div class="text-h6">Register</div>
          <q-form
            @submit="register"
          >
            <q-input v-model="username" label="Username" :rules="[ val => val && val.length > 0 || 'Please enter a username']"/>
            <q-input v-model="password" type="password" label="Password" :rules="[ val => val && val.length > 0 || 'Please enter a password']"/>
            <q-btn label="Submit" type="submit" color="primary"/>
          </q-form>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import axios from 'axios'
import sha256 from 'crypto-js/sha256'

export default {
  name: 'Auth',
  data () {
    return {
      mode: this.$route.params.mode,
      username: null,
      password: null
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
  watch: {
    mode (val) {
      history.pushState(
        { urlPath: `/#/auth/${val}` },
        '',
        `/#/auth/${val}`
      )
    }
  },
  methods: {
    register () {
      let self = this

      console.log('Registering...')
      console.log({
        username: self.username,
        password: String(sha256(String(self.password)))
      })

      axios
        .post(`http://localhost:3000/api/auth/create`, {
          username: self.username,
          password: String(sha256(String(self.password)))
        })
        .then((response) => {
          console.log(response)

          if (response.data === 'Missing Register Details!') {
            this.$q.notify({ message: 'Missing Register Details!', color: 'red' })
          } else {
            this.$q.notify({ message: 'Succesfully Registered!', color: 'green' })
            self.mode = 'login'
          }
        })
    },
    login () {
      let self = this

      console.log('Logging In...')
      console.log({
        username: self.username,
        password: String(sha256(String(self.password)))
      })

      axios
        .post(`http://localhost:3000/api/auth/login`, {
          username: self.username,
          password: String(sha256(String(self.password)))
        })
        .then((response) => {
          console.log(response)

          if (!response.data) {
            this.$q.notify({ message: 'Incorrect Username/Password!', color: 'red' })
          } else {
            this.$q.notify({ message: 'Succesfully Logged In!', color: 'green' })
          }
        }).catch(function (err) {
          console.log(err)
          self.$q.notify({ message: 'Incorrect Username/Password!', color: 'red' })
        })
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
