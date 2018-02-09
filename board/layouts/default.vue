<template>
  <v-app>
    <notifications group="info" />
    <notifications group="error" />
    <v-navigation-drawer clipped v-model="drawer" fixed app>
      <v-toolbar flat>
        <!-- show back button and note name -->
        <template v-if="paths.length">
          <v-btn icon @click="backToParentFolder()" nuxt :to="paths.length === 1 ? '/' : `/note/${paths[paths.length - 2].id}`">
            <v-icon>navigate_before</v-icon>
          </v-btn>
          <v-toolbar-title>{{ paths[paths.length - 1].name }}</v-toolbar-title>
        </template>
        <!-- show hello -->
        <v-toolbar-title v-else>Notes</v-toolbar-title>

        <v-spacer></v-spacer>
        <AddNoteDialog />
        <DeleteNoteDialog v-show="$store.state.paths.length" />
      </v-toolbar>

      <v-divider></v-divider>

      <v-list two-line subheader>
        <v-list-tile avatar v-for="item in root_notes" :key="item.id" @click="goChildFolder(item)" nuxt :to="`/note/${item.id}`">
          <v-list-tile-avatar>
            <v-icon>mdi-file-document-box</v-icon>
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
      <nuxt-link to="/" style="height: 40px; margin-left: 10px;">
        <img src="~/static/landing.png" style="width: auto; height: 40px;">
      </nuxt-link>
      <v-toolbar-title>{{ boards[0].name }}</v-toolbar-title>
      
      <v-spacer></v-spacer>

      <!-- 右側按鈕放這裡 -->

      
      <v-btn icon nuxt to="/search" active-class="null">
        <v-icon>search</v-icon>
      </v-btn>
      <ImportNoteDialog />
      <v-btn outline color="indigo" href="/" target="_blank">
        Tap MD <v-icon style="padding-left: 5px;">open_in_new</v-icon>
      </v-btn>
     
    </v-toolbar>
    <v-content :class="{ div: show_background }">
      <v-container fill-height>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<style scoped>
.div {
  background-image: url(~/static/cover.jpg);
  background-size: cover;
  padding: 0;
  background-position: center center;
}
</style>


<script>
  import { mapState, mapActions } from 'vuex'
  import AddNoteDialog from '~/components/AddNoteDialog'
  import DeleteNoteDialog from '~/components/DeleteNoteDialog'
  import ImportNoteDialog from '~/components/ImportNoteDialog'
  export default {
    data () {
      return {
        drawer: true, // 開啟狀態
        fixed: false
      }
    },
    computed: {
      show_background () {
        return this.$route.name === 'index'
      },
      ...mapState([
        'boards',
        'root_notes',
        'paths'
      ])
    },
    watch: {
      $route (route) {
        if (route.name === 'index') {
          this.$store.dispatch('backToRootFolder')
        }
      }
    },
    methods: {
      test ($event) {
        $event.stopPropagation()
        console.log('test')
      },
      addNote () {
        this.$store.commit('add_note_dialog', true)
      },
      ...mapActions([
        'goChildFolder',
        'backToParentFolder'
      ])
    },
    components: {
      AddNoteDialog,
      ImportNoteDialog,
      DeleteNoteDialog
    }
  }
</script>
