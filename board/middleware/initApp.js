export default async function ({ store, error }) {
  if (!store.state.initialized) {
    try {
      await store.dispatch('initApp')
    } catch (err) {
      error(err)
    }
  }
}
