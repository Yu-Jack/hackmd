<template>
  <v-app>
    <v-navigation-drawer
      clipped
      v-model="drawer"
      fixed
      app
    >
      <v-toolbar flat v-if="paths.length">
        <v-btn icon @click="backToParentFolder()">
          <v-icon>navigate_before</v-icon>
        </v-btn>
        <v-toolbar-title>{{ paths[paths.length - 1].name }}</v-toolbar-title>
        <!-- <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              Application
            </v-list-tile-title>
          </v-list-tile>
        </v-list> -->
      </v-toolbar>

      <v-divider></v-divider>

      <!-- <v-list>
        <v-list-tile
          :key="note.id"
          v-for="(note) in root_notes"
          exact
        >
          <v-list-tile-action>
            <v-icon>apps</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="note.name"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list> -->
      <v-list two-line subheader>
        <div v-if="folders.length">
          <v-subheader inset>Folders</v-subheader>
          <v-list-tile avatar v-for="item in folders" :key="item.title" @click="goChildFolder(item.note)">
            <v-list-tile-avatar>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <!-- <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title> -->
            </v-list-tile-content>
            <!-- <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action> -->
          </v-list-tile>
          <v-divider inset></v-divider>
        </div>
        
        <div v-if="files.length">
          <v-subheader inset>Files</v-subheader>
          <v-list-tile v-for="item in files" :key="item.title" avatar nuxt :to="`/note/${item.note.id}`">
            <v-list-tile-avatar>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <!-- <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title> -->
            </v-list-tile-content>
            <!-- <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action> -->
          </v-list-tile>
        </div>
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
      folders () {
        return this.root_notes
          .filter((note) => note.type === 'folder')
          .map((note) => ({
            icon: 'folder',
            title: note.name,
            note: note
          }))
      },
      files () {
        return this.root_notes
          .filter((note) => note.type === 'file')
          .map((note) => ({
            icon: 'note',
            title: note.name,
            note: note
          }))
      },
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
