<template>
  <v-app>
    <v-navigation-drawer clipped v-model="drawer" fixed app>
      <v-toolbar flat v-if="paths.length">
        <v-btn icon @click="backToParentFolder()" nuxt :to="paths.length === 1 ? '/' : `/note/${paths[paths.length - 1].id}`">
          <v-icon>navigate_before</v-icon>
        </v-btn>
        <v-toolbar-title>{{ paths[paths.length - 1].name }}</v-toolbar-title>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list two-line subheader>
        <v-list-tile avatar v-for="item in root_notes" :key="item.id" @click="goChildFolder(item)" nuxt :to="`/note/${item.id}`">
          <v-list-tile-avatar>
            <v-icon>folder</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar fixed app clipped-left>
      <!-- 左側按鈕 -->
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{ boards[0].name }}</v-toolbar-title>
      
      <v-spacer></v-spacer>

      <!-- 右側按鈕放這裡 -->

      <!--
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>menu</v-icon>
      </v-btn>
      -->
    </v-toolbar>
    <v-content>
      <v-container fill-height>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    data () {
      return {
        drawer: true, // 開啟狀態
        fixed: false
      }
    },
    computed: {
      ...mapState([
        'boards',
        'root_notes',
        'paths'
      ])
    },
    methods: {
      ...mapActions([
        'goChildFolder',
        'backToParentFolder'
      ])
    }
  }
</script>
