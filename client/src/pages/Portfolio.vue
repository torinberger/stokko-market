<template>
  <div class="portfolio-page">
    <div v-if="ready" class="container">
      <h3>{{ user.username }}<h5>#{{ user._id }}</h5></h3><span>${{ Math.round(user.balance * 100) / 100 }}</span>
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
</template>

<script>

import axios from 'axios'

export default {
  name: 'Portfolio',
  components: {
    portfolioChart: () => import('../components/PortfolioChart.vue')
  },
  data () {
    return {
      user: null,
      err: null,
      ready: false
    }
  },
  created () {
    console.log('user', this.$route.params.user)
    let user = this.$route.params.user

    if (user === undefined) {
      this.loadSelf(this.$store.state.user)
    } else {
      this.loadOther(user)
    }
  },
  methods: {
    loadSelf (id) {
      console.log('user id', id)
      if (id === '') {
        this.$router.push('/auth/login')
      } else {
        let self = this
        axios
          .get(`http://localhost:3000/api/users/get/user/${self.$store.state.user}`, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Authorization': 'Bearer ' + self.$store.state.JWTtoken
            }
          })
          .then((response) => {
            let user = response.data[0]
            console.log('User', user)
            self.user = user
            self.ready = true
            self.$store.commit('updateBalance', user.balance)
          })
          .catch((err) => {
            self.err = err
          })
      }
    },
    loadOther (user) {
      let self = this
      axios
        .get(`http://localhost:3000/api/users/get/users/`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + self.$store.state.JWTtoken
          }
        })
        .then((response) => {
          let users = response.data
          console.log('Users', users)

          for (var i = 0; i < users.length; i++) {
            if (users[i].username === user) {
              self.user = users[i]
              self.ready = true
              return
            }
          }

          self.err = 'User Not Found'
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
</style>
