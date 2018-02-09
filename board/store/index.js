export const state = () => ({
  initialized: false,
  sidebar: false,
  boards: [],
  root_notes: [],
  paths: [],
  add_note_dialog: false
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
  paths (state, payload) {
    state.paths = payload
  },
  push_path (state, payload) {
    state.paths.push(payload)
  },
  pop_path (state) {
    state.paths.pop()
  },
  add_note_dialog (state, payload) {
    state.add_note_dialog = payload
  },
  current_folder (state, payload) {
    state.current_folder = payload
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

  async backToRootFolder ({ state, commit, dispatch }) {
    await dispatch('fetchRootNotes', state.boards[0].id)
    commit('paths', [])
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
    this.$router.push(`/note/${folder.id}`)
  },

  async fetchRootNotes ({ commit }, boardId) {
    const data = await this.$axios.$post('/remark/get-root-notes', { id: boardId })
    if (data.status !== 0) {
      throw new Error(data.msg)
    }
    commit('root_notes', data['root-notes'])
  },

  async fetchSubNotes ({ commit }, folder) {
    const data = await this.$axios.$post('/remark/get-sub-notes', { id: folder.id })
    if (data.status !== 0) {
      throw new Error(data.msg)
    }
    commit('root_notes', data['sub-notes'])
  },

  async fetchBoards ({ commit }) {
    const data = await this.$axios.$post('/remark/get-board-list', { name: 'tappay' })
    if (data.status !== 0) {
      throw new Error(data.msg)
    }
    commit('boards', data.boards)
  },

  async addNote ({ dispatch }, payload) {
    if (payload.short_id) {
      await dispatch('linkNote', payload)
    } else {
      await dispatch('createAndLinkNote', payload)
    }
  },

  async linkNote ({ state, commit, dispatch }, payload) {
    const postData = {
      board_id: state.boards[0].id,
      parent_id: state.paths.length ? state.paths[state.paths.length - 1].id : '',
      name: payload.name,
      short_id: payload.short_id
    }
    const result = await this.$axios.$post('/remark/link-note', postData)
    if (result.status !== 0) {
      throw new Error(result.msg)
    }
    if (state.paths.length) {
      await dispatch('fetchSubNotes', state.paths[state.paths.length - 1])
    } else {
      await dispatch('fetchRootNotes', state.boards[0].id)
    }
  },

  async createAndLinkNote ({ state, commit, dispatch }, payload) {
    const postData = {
      board_id: state.boards[0].id,
      parent_id: state.paths.length ? state.paths[state.paths.length - 1].id : '',
      name: payload.name
    }
    await this.$axios.$post('/new-in-board', postData)

    if (state.paths.length) {
      await dispatch('fetchSubNotes', state.paths[state.paths.length - 1])
    } else {
      await dispatch('fetchRootNotes', state.boards[0].id)
    }
  },

  async unlinkNote ({ state, commit, dispatch }) {
    const postData = {
      board_id: state.boards[0].id,
      id: state.paths[state.paths.length - 1].id
    }
    const result = await this.$axios.$post('/remark/unlink-note', postData)
    if (result.status !== 0) {
      throw new Error(result.msg)
    }
    dispatch('backToParentFolder')
  }
}
