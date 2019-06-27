<template>
  <q-page style="background: url('https://wallpaperset.com/w/full/0/6/5/198508.jpg');">
    <div class="row justify-center">
      <div id="info" class="col-3 self-center">
        <h3>Stokko Market</h3>
        <p>An online stock market game based on real time stock data and history. Play against other players and try to reach the top of the leaderboard!</p>

        <div class="column">
          <router-link class="self-center" to="/auth/register"><p class="self-center" style="text-align: center;">Signup</p></router-link>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>

.col-3 {
  margin-top: 30vh;
  border-radius: 3px;
}

#info {
  background: white;
  padding: 1vh;
}

h3, h5, p, a {
  margin: 1vh;
}

h3, h5, #info > p {
  margin-bottom: 2vh;
}

h5 {
  color: white;
}

a {
  font-size: 2vh;
  width: 95%;
  text-decoration: none;
  border-radius: 3px;
  color: white;
  background: #027BE3;
  padding: 0.5vh;
}

</style>

<script>
export default {
  name: 'PageIndex'
}
</script>
