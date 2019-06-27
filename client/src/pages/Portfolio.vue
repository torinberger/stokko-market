<template>
  <div class="flex flex-center">
    <div class="portfolio-page">
      <div v-if="ready" class="container">
        <h5 style="float: right;">${{ Math.round(user.balance * 100) / 100 }}</h5><h3>{{ user.username }}</h3><p>#{{ user._id }}</p>
        <portfolio-chart :user="user._id"></portfolio-chart>
      </div>
      <div v-if="!ready" class="loading-container">
        <q-circular-progress
          v-if="!err"
          indeterminate
          size="40px"
          color="blue-6"
          class="q-ma-md"
        />
        <h4 :if="err">{{ err }}</h4>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Portfolio',
  components: {
    portfolioChart: () => import('../components/PortfolioChart.vue') // import portfolio chart
  },
  data () {
    return {
      user: null,
      err: null,
      ready: false
    }
  },
  created () {
    console.log('User route param:', this.$route.params.user)
    let user = this.$route.params.user // get user to target

    if (user === undefined) { // if user specified search for that user
      this.loadSelf(this.$store.state.user)
    } else { // if no user specified search for self
      this.loadOther(user)
    }
  },
  methods: {
    loadSelf (id) { // load self from own ID
      console.log('User id', id)
      if (id === '') { // if there is no ID, log in
        this.$router.push('/auth/login')
      } else {
        let self = this
        axios // request user info
          .get(`http://localhost:3000/api/users/get/user/${self.$store.state.user}`, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Authorization': 'Bearer ' + self.$store.state.JWTtoken
            }
          })
          .then((response) => {
            let user = response.data[0] // store user info
            self.user = user // display user data
            self.ready = true // ready the portfolio
            self.$store.commit('updateBalance', user.balance) // update user's balance globally
          })
          .catch((err) => { // if there is an error, display it
            self.err = err
          })
      }
    },
    loadOther (user) { // load in the target user
      let self = this
      axios // get all users
        .get(`http://localhost:3000/api/users/get/users/`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + self.$store.state.JWTtoken
          }
        })
        .then((response) => {
          let users = response.data

          // search through all users and find user with matching username
          for (var i = 0; i < users.length; i++) {
            if (users[i].username === user) {
              self.user = users[i] // display user info
              self.ready = true // ready the portfolio
              return
            }
          }

          self.err = 'User Not Found' // dipslay error if user could not be found
        })
        .catch((err) => { // if error finding all users, log it
          self.err = err
        })
    }
  }
}
</script>

<style scoped>
.loading-container {
  height: calc(100vh - 50px);
  display: flex;
  justify-content: center;
  align-items: center;
}

h3 {
  margin: 0;
  margin-top: 5vh;
  margin-bottom: 1vh;
}

h5 {
  margin: 2vh;
}

p {
  font-size: 2vh;
  color: grey;
  margin: 0;
  margin-bottom: 3vh;
}
</style>
