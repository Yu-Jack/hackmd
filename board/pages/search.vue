<template>
  <v-layout>
    <v-flex>
      <v-card style="width: 100%; height: 100%">
          <v-card-title style="padding-bottom: 0;">
            <v-text-field
                prepend-icon="search"
                label="查詢標題"
                v-model="title"
                @keydown.native.enter="search"
                @input="search"
                style="max-width: 300px; margin: 0 auto;"
                autofocus
            ></v-text-field>
          </v-card-title>
          <v-alert type="error" :value="error_message" style="max-width: 300px; margin: 0 auto;">
            {{ error_message }}
          </v-alert>
          <v-list style="max-width: 300px; margin: 0 auto;">
            <template v-for="item in items">
              <v-list-tile  :key="item.id" nuxt :to="`/note/${item.id}`">
                <v-list-tile-content>
                  <v-list-tile-title style="text-align: center">{{ item.name }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import _ from 'underscore'
export default {
  data () {
    return {
      title: null,
      items: [],
      error_message: null
    }
  },
  methods: {
    async $_search () {
      const result = await this.$axios.$post('/remark/query', {
        board_id: this.$store.state.boards[0].id,
        name: this.title
      })
      if (result.status !== 0) {
        this.error_message = result.msg
        return
      }
      this.items = result.notes
      this.error_message = this.items.length ? '' : '無搜尋結果'
    },
    search: _.throttle(function () {
      this.$_search()
    }, 1000)
  }
}
</script>
