<template>
  <v-dialog v-model="is_open" :persistent="can_close" max-width="500px">
      <v-btn slot="activator">
        從 HackMD 匯入 <v-icon style="padding-left: 5px;">file_download</v-icon>
      </v-btn>
      <v-form ref="form">
        <v-card>
          <v-card-title>
            <span class="headline">從 HackMD 匯入</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="session"
                    label="connect.sid"
                    hint="請登入 HackMD 之後複製 connect.sid 這個 cookie"
                    persistent-hint
                    required
                    :rules="session_rules"
                  ></v-text-field>
                </v-flex>
                <template v-if="import_result">
                  <v-flex xs12>
                    <v-alert type="success" :value="import_result.import_count">
                      成功從 HackMD import {{ import_result.import_count }} 個 Note
                    </v-alert>
                  </v-flex>
                  <v-flex xs12>
                    <v-card color="orange darken-1" v-if="import_result.errors.length">
                      <v-card-title primary-title>
                        <h3 class="headline mb-0">
                          <v-icon color="orange darken-4">mdi-alert</v-icon>
                          以下 Note 沒有成功
                        </h3>
                        <h4 class="subheading">
                          請你自己去 HackMD 複製過來囉～
                        </h4>
                      </v-card-title>
                      <v-list>
                        <template v-for="(item, index) in import_result.errors">
                          <v-list-tile :key="item.id" target="_blank" :href="`https://hackmd.io/s/${item.id}`">
                            <v-list-tile-content>
                              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                              <v-list-tile-sub-title>{{ item.error_message }}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                              <v-icon>open_in_new</v-icon>
                            </v-list-tile-action>
                          </v-list-tile>
                          <v-divider v-if="index + 1 < import_result.errors.length" :key="index"></v-divider>
                        </template>
                      </v-list>
                    </v-card>
                  </v-flex>
                </template>
                <v-flex xs12>

                </v-flex>
                <v-flex xs12>
                  <v-alert type="error" :value="error_message">
                    {{ error_message }}
                  </v-alert>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="startImport" :loading="is_loading">Start Import</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      is_open: false,
      is_loading: false,
      error_message: '',
      session: '',
      session_rules: [
        v => !!v || '請填入 HackMD 的 connect.sid'
      ],
      import_result: null
    }
  },
  computed: {
    can_close () {
      // prevent dialog close when click outside
      return this.is_loading
    }
  },
  watch: {
    is_open (value) {
      if (value === true) {
        this.$refs.form.reset()
        this.is_loading = false
        this.error_message = ''
        this.session = ''
        this.import_result = null
      }
    }
  },
  methods: {
    async startImport () {
      if (!this.$refs.form.validate()) return

      this.is_loading = true
      try {
        const result = await this.$axios.$post('/import', { sid: this.session })
        this.import_result = result
        this.is_loading = false
      } catch (error) {
        this.error_message = error.message
        this.is_loading = false
      }
    },
    close () {
    }
  }
}
</script>
