<template>
  <div id="auth">
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
      mode: this.$route.params.mode, // mode either login or register for displaying different forms
      username: null, // username and password to keep track of user input
      password: null
    }
  },
  created () { // determine the mode from the URL parameters
    if (this.mode !== 'login' && this.mode !== 'register') {
      this.mode = 'login'
    }

    history.pushState( // redirect to correct URL
      { urlPath: `/#/auth/${this.mode}` },
      '',
      `/#/auth/${this.mode}`
    )
  },
  watch: {
    mode (val) { // if mode changes redirect accordingly
      history.pushState(
        { urlPath: `/#/auth/${val}` },
        '',
        `/#/auth/${val}`
      )
    }
  },
  methods: {
    register () { // when user hits register form submit
      let self = this

      console.log('Registering...')
      console.log('User details:', {
        username: self.username,
        password: String(sha256(String(self.password)))
      })

      axios // create a user account
        .post(`http://localhost:3000/api/auth/create`, {
          username: self.username,
          password: String(sha256(String(self.password)))
        })
        .then((response) => {
          if (!response.data || !response.data.token) { // if err
            this.$q.notify({ message: 'Uknown Error!', color: 'orange' })
          } else { // if no err
            this.$q.notify({ message: 'Succesfully Registered!', color: 'green' })

            // update user meta data globally
            this.$store.commit('setJWTtoken', response.data.token)
            this.$store.commit('setUser', response.data.user._id)
            console.log('User token', this.$store.state.JWTtoken)
            console.log('User ID', this.$store.state.user)

            // redirect to user portfolio
            self.$router.push('/portfolio/')
          }
        }).catch(function (err) { // if err
          console.log('Error registering user', err)
          self.$q.notify({ message: 'Username/Password Taken', color: 'red' })
          this.password = '' // reset password for security
        })
    },
    login () { // if user tries to login
      let self = this

      console.log('Logging In...')
      console.log('User details:', {
        username: self.username,
        password: String(sha256(String(self.password)))
      })

      axios // login server side
        .post(`http://localhost:3000/api/auth/login`, {
          username: self.username,
          password: String(sha256(String(self.password)))
        })
        .then((response) => {
          if (!response.data || !response.data.token) { // if err
            this.$q.notify({ message: 'Uknown Error!', color: 'orange' })
          } else { // if no err
            this.$q.notify({ message: 'Succesfully Logged In!', color: 'green' })

            // update user meta data globally
            this.$store.commit('setJWTtoken', response.data.token)
            this.$store.commit('setUser', response.data.user._id)
            console.log('User token', this.$store.state.JWTtoken)
            console.log('User ID', this.$store.state.user)

            // redirect to portfolio
            self.$router.push('/portfolio/')
          }
        }).catch(function (err) { // if error logging in
          console.log('Error logging in user', err)
          self.$q.notify({ message: 'Incorrect Username/Password!', color: 'red' })
          self.password = null
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
