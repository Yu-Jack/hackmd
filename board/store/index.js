export const state = () => ({
  initialized: false,
  sidebar: false,
  boards: [],
  root_notes: [],
  paths: []
})

export const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  },
  initApp (state) {
    state.initialized = true
  },
  boards (state, payload) {
    state.boards = payload
  },
  root_notes (state, payload) {
    state.root_notes = payload
  },
  push_path (state, payload) {
    state.paths.push(payload)
  },
  pop_path (state) {
    state.paths.pop()
  }
}

export const actions = {
  async initApp ({ state, commit, dispatch }) {
    // 1. /remark/get-board-list
    await dispatch('fetchBoards')

    // 2. /remark/get-root-notes from root_notes[0]
    await dispatch('fetchRootNotes', state.boards[0].id)

    commit('initApp')
  },

  async backToParentFolder ({ state, commit, dispatch }) {
    if (state.paths.length === 1) {
      await dispatch('fetchRootNotes', state.boards[0].id)
      commit('pop_path')
    } else {
      // fetch sub notes
      const parent = state.paths[state.paths.length - 2]
      await dispatch('fetchSubNotes', parent)
      commit('pop_path')
    }
  },

  async goChildFolder ({ state, commit, dispatch }, folder) {
    await dispatch('fetchSubNotes', folder)
    commit('push_path', folder)
  },

  async fetchRootNotes ({ commit }, boardId) {
    const data = await this.$axios.$post('/remark/get-root-notes', { id: boardId })
    if (data.status !== 0) {
      throw new Error(500)
    }
    commit('root_notes', data['root-notes'])
  },

  async fetchSubNotes ({ commit }, folder) {
    const data = await this.$axios.$post('/remark/get-sub-notes', { id: folder.id })
    if (data.status !== 0) {
      throw new Error(500)
    }
    commit('root_notes', data['sub-notes'])
  },

  async fetchBoards ({ commit }) {
    const data = await this.$axios.$post('/remark/get-board-list', { name: 'tappay' })
    if (data.status !== 0) {
      throw new Error(500)
    }
    commit('boards', data.boards)
  }
}
