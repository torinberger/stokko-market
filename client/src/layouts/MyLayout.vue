<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          Stokko Market
        </q-toolbar-title>

        <div>
          <span v-if="balance">${{ balance }}</span>
          <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            aria-label="Menu"
          >
            <q-icon name="menu" />
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      overlay
      side="right"
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>
          Essential Links
          <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            aria-label="Close"
            style="float: right; margin-top: -1vh;"
          >
            <q-icon name="close" />
          </q-btn>
        </q-item-label>
        <q-item clickable tag="a" href="/#/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
            <q-item-label caption>Homepage</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" href="/#/stock/">
          <q-item-section avatar>
            <q-icon name="bar_chart" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Stocks</q-item-label>
            <q-item-label caption>Search Stocks</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" href="/#/auth/login">
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Login</q-item-label>
            <q-item-label caption>Login/Register</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" href="/#/portfolio/">
          <q-item-section avatar>
            <q-icon name="supervisor_account" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Portfolio</q-item-label>
            <q-item-label caption>View Your Own Profile and Other's</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  computed: {
    balance () {
      return this.$store.state.balance
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
.q-drawer {
  top: 0 !important;
}
</style>
