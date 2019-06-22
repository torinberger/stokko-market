<template>
  <div class="leaderboard-page">
    <div v-if="ready" class="container column">
      <router-link
        :to="'/portfolio/' + user.username"
        class="rank self-center"
        v-bind:key="user._id"
        v-for="(user, index) in leaderboard"
        v-bind:style="{ background: (userID === user._id ? 'white' : 'grey') }"
      >
        <span>{{ index+1 }}. </span><span>{{ user.username }} - ${{ user.balance }}</span>
      </router-link>
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

.rank {
  width: 80vw;
  display: block;
}

a {
  color: black;
  text-decoration: none;
}

a:hover {
  color: black;
}
</style>
