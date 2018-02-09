<template>
  <v-dialog v-model="dialog" max-width="290">
    <v-btn icon slot="activator">
      <v-icon>delete</v-icon>
    </v-btn>
    <v-card>
      <v-card-title class="headline">真的要刪掉嗎？</v-card-title>
      <v-card-text>只會把 Note 從 Remark 中移除，您仍然可以 History 中找到他</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" flat @click.native="unlinkNote">確認刪除</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    async unlinkNote () {
      try {
        await this.$store.dispatch('unlinkNote')
        this.dialog = false
      } catch (error) {
        this.$notify({
          group: 'error',
          type: 'error',
          title: '失敗了',
          text: error.message
        })
      }
    }
  }
}
</script>
