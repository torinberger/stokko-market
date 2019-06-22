<template>
  <div class="leaderboard-page">
    <div class="container">
      <div class="rank" v-bind:key="user._id" v-for="(user, index) in leaderboard" v-bind:style="{ background: (userID === user._id ? 'white' : 'grey') }">
        <span>{{ index+1 }}. </span><span>{{ user.username }} - ${{ user.balance }}</span>
      </div>
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
      leaderboard: []
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
        })
    }
  }
}

</script>
