<template>
  <div class="stock-page">

    <!-- <q-search
      inverted color="blue-6"
      v-model="terms"
      placeholder="Featuring static data">

      <q-autocomplete
        :static-data="{field: 'value', list: countries}"
        @selected="requestStock"
      />
    </q-search> -->

    <q-select
      filled
      v-model="model"
      use-input
      input-debounce="0"
      label="Simple filter"
      :options="options"
      @filter="filterFn"
      style="width: 250px"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <stock-chart :stock="$route.params.stock"></stock-chart>
  </div>
</template>

<script>

const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]

export default {
  name: 'Stock',
  components: {
    StockChart: () => import('../components/StockChart.vue')
  },
  data () {
    return {
      terms: '',
      countries: [
        {
          value: 'test',
          label: 'test',
          icon: 'alarm'
        }
      ],
      model: null,
      options: stringOptions
    }
  },
  methods: {
    requestStock () {
      console.log(this.terms)
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = stringOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    }
  }
}
</script>

<style scoped>

</style>
