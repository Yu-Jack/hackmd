export default async function ({ store, error, route }) {
  console.log('initapp route', route)
  if (!store.state.initialized) {
    try {
      const noteId = route.name === 'note-id' ? route.params.id : null
      await store.dispatch('initApp', noteId)
    } catch (err) {
      error(err)
    }
  }
}
