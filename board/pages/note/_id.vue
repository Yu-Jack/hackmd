<template>
  <v-layout>
    <v-flex>
      <iframe style="width: 100%; height: 100%" :src="`/s/${note.shortid}`" frameborder="0"></iframe>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  async asyncData ({ params, app }) {
    const note = await app.$axios.$post('/remark/get-note', { id: params.id })
    return {
      note: note
    }
  }
}
</script>
