import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
    },
    state: {
      JWTtoken: '',
      user: '',
      balance: null
    },
    mutations: {
      setJWTtoken (state, token) {
        state.JWTtoken = token
      },
      setUser (state, id) {
        state.user = id
      },
      updateBalance (state) {
        if (state.user) {
          axios
            .get(`http://localhost:3000/api/users/get/user/${state.user}`, {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + state.JWTtoken
              }
            })
            .then((response) => {
              let user = response.data[0]
              console.log('User', user)
              state.balance = user.balance
            })
        }
      }
    },
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
