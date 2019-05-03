<template>
  <div id="app">

    <q-layout view="hHr LpR lFf">
      <!-- Header -->
      <q-layout-header>
        <!-- First row of header is a QToolbar -->
        <q-toolbar color="dark">

          <q-toolbar-title>
            Layout Header
          </q-toolbar-title>

          <!-- showRight is a model attached to right side drawer below -->
          <q-btn
            flat round dense
            @click="showRight = !showRight"
            icon="menu"
          />
        </q-toolbar>

      </q-layout-header>

      <!-- Right Side Panel -->
      <q-layout-drawer side="right" v-model="showRight" :overlay="true">
        Right Side of Layout
      </q-layout-drawer>

      <!-- sub-routes get injected here: -->
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>

  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      showRight: false
    }
  }
}
</script>

<style>
.q-loading-bar {
  display: none;
}
</style>
