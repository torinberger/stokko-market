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
      userID: null,
      leaderboard: [],
      ready: false,
      err: ''
    }
  },
  created () {
    let self = this
    if (self.$store.state.user) {
      axios
        .get(`http://localhost:3000/api/users/get/user/${self.$store.state.user}`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + self.$store.state.JWTtoken
          }
        })
        .then((response) => {
          let user = response.data[0]
          self.userID = user._id
          console.log('User', user)
          self.$store.commit('updateBalance', user.balance)
          self.loadBoard()
        })
        .catch((err) => {
          self.err = err
        })
    } else {
      self.loadBoard()
    }
  },
  methods: {
    loadBoard () {
      let self = this
      axios
        .get(`http://localhost:3000/api/users/get/users/`, {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
        .then((response) => {
          let users = response.data

          users.sort(function (a, b) {
            if (a.balance > b.balance) {
              return -1
            } else if (a.balance === b.balance) {
              return 0
            } else if (a.balance < b.balance) {
              return 1
            }
          })

          self.leaderboard = users
          self.ready = true
        })
        .catch((err) => {
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
