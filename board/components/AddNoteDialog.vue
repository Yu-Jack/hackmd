<template>
  <v-dialog v-model="add_note_dialog" :persistent="can_close" max-width="500px">
      <v-btn icon slot="activator">
        <v-icon>add</v-icon>
      </v-btn>
      <v-form ref="form" v-model="valid">
        <v-card>
          <v-card-title>
            <span class="headline">新增 Note</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="note_name"
                    label="Note 名稱"
                    required
                    :rules="note_name_rules"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="short_id"
                    label="Short ID"
                    hint="如果網址是：https://tapmd.tappaysdk.com/s/BJljRSHIz，則填入「BJljRSHIz」。"
                    required
                    persistent-hint
                    :rules="short_id_rules"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Close</v-btn>
            <v-btn color="blue darken-1" flat @click="save" :loading="is_loading">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
</template>

<script>
// import { mapState } from 'vuex'
export default {
  data () {
    return {
      is_loading: false,
      note_name: '',
      short_id: '',
      valid: false,
      note_name_rules: [
        v => !!v || '請填入 Note 名稱'
      ],
      short_id_rules: [
        v => !!v || '請填入 Short ID'
      ]
    }
  },
  computed: {
    add_note_dialog: {
      get () {
        return this.$store.state.add_note_dialog
      },
      set (value) {
        if (this.is_loading) return

        this.$store.commit('add_note_dialog', value)
      }
    },
    can_close () {
      // prevent dialog close when click outside
      return this.is_loading
    }
  },
  watch: {
    add_note_dialog (newValue) {
      if (newValue === true) {
        this.$refs.form.reset()
        this.reset()
      }
    }
  },
  methods: {
    reset () {
      this.note_name = ''
      this.short_id = ''
    },
    async save () {
      if (this.$refs.form.validate()) {
        this.is_loading = true
        try {
          await this.$store.dispatch('linkNote', {
            name: this.note_name,
            short_id: this.short_id
          })
          this.$notify({
            group: 'info',
            title: 'Important message',
            text: 'Hello user! This is a notification!'
          })
          this.close()
        } catch (error) {
          this.$notify({
            group: 'info',
            title: '失敗了',
            text: 'Hello user! This is a notification!'
          })
        }
        this.is_loading = false
      }
    },
    close () {
      this.add_note_dialog = false
    }
  }
}
</script>
