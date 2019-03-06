<template>
  <v-dialog v-model="edit_note_dialog" :persistent="can_close" max-width="500px">
      <v-btn icon slot="activator">
        <v-icon>edit</v-icon>
      </v-btn>
      <v-form ref="form" v-model="valid">
        <v-card>
          <v-card-title>
            <span class="headline">編輯 {{ this.current_note.name }} 名稱</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="note_name"
                    label="Note 新名稱"
                    required
                    :rules="note_name_rules"
                  ></v-text-field>
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
            <v-btn color="blue darken-1" flat @click="close">Close</v-btn>
            <v-btn color="blue darken-1" flat @click="save" :loading="is_loading">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      error_message: null,
      is_loading: false,
      note_name: '',
      short_id: '',
      valid: false,
      note_name_rules: [
        v => !!v || '請填入 Note 名稱'
      ]
    }
  },
  computed: {
    edit_note_dialog: {
      get () {
        return this.$store.state.edit_note_dialog
      },
      set (value) {
        if (this.is_loading) return

        this.$store.commit('edit_note_dialog', value)
      }
    },
    can_close () {
      // prevent dialog close when click outside
      return this.is_loading
    },
    ...mapState([
        'current_note'
      ])
  },
  watch: {
    edit_note_dialog (newValue) {
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
      this.error_message = ''
    },
    async save () {
      if (this.$refs.form.validate()) {
        this.is_loading = true
        try {
          await this.$store.dispatch('editNote', {
            name: this.note_name,
            id: this.current_note.id
          })
          this.$notify({
            group: 'info',
            title: '更新成功'
          })
          this.is_loading = false
          this.close()
        } catch (error) {
          this.error_message = error.message
          this.is_loading = false
        }
      }
    },
    close () {
      this.edit_note_dialog = false
    }
  }
}
</script>
