<template>
  <div class="leaderboard-page">
    <div v-if="ready" class="leaderboard-container">
      <div class="container column">
        <h3 style="text-align:center;margin: 1vh;">Leaderboard</h3>
        <router-link
          :to="'/portfolio/' + user.username"
          class="rank self-center"
          v-bind:key="user._id"
          v-for="(user, index) in leaderboard"
          v-bind:style="{ background: (userID === user._id ? '#027BE3' : 'white'), color: (userID === user._id ? 'white' : 'black') }"
          elevated
        >
          <span>{{ index+1 }}. </span><span>{{ user.username }}<span style="float: right;">${{ Math.round(user.balance * 100) / 100 }}</span></span>
        </router-link>
      </div>
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
</template>

<script type="text/javascript">

import axios from 'axios'

export default {
  name: 'Leaderboard',
  data () {
    return {
      userID: null, // user ID to check which user to highlight as self
      leaderboard: [],
      ready: false,
      err: ''
    }
  },
  created () {
    let self = this
    if (self.$store.state.user) { // check if user is logged in
      axios
        .get(`http://localhost:3000/api/users/get/user/${self.$store.state.user}`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + self.$store.state.JWTtoken // give auth token
          }
        })
        .then((response) => {
          let user = response.data[0] // get user data
          self.userID = user._id // set user id
          self.$store.commit('updateBalance', user.balance) // update user balance
          self.loadBoard() // load the leaderboard
        })
        .catch((err) => { // if error getting the user
          self.err = err
        })
    } else {
      self.loadBoard() // if user not logged in just load the leaderboard
    }
  },
  methods: {
    loadBoard () { // when user is found or not found, load the leaderboard
      let self = this
      axios
        .get(`http://localhost:3000/api/users/get/users/`, { // get all users
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
        .then((response) => {
          let users = response.data

          users.sort(function (a, b) { // sort users from highest balance to lowest
            if (a.balance > b.balance) {
              return -1
            } else if (a.balance === b.balance) {
              return 0
            } else if (a.balance < b.balance) {
              return 1
            }
          })

          self.leaderboard = users // display users
          self.ready = true // ready the leaderboard
        })
        .catch((err) => {
          self.err = err // if error display the error
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

.leaderboard-container {
  margin-top: 5vh;
  background: white;
  width: 40vw;
  padding: 2vw;
  margin-left: calc(calc(100vw - 44vw) / 2);
}

.rank {
  width: 100%;
  margin: 1vh;
  margin-left: 0vh;
  margin-right: 0vh;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 2vh;
  display: block;
}

h3 {
  color: black;
}

a {
  color: black;
  text-decoration: none;
}

a:hover {
  color: black;
}
</style>
