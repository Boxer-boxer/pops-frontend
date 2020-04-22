export const state = () => ({
  isAuthenticate: false,
  user: {
    firstName: null,
    secondName: null,
    username: null
  }
})

export const mutations = {
  login(state) {
    state.isAuthenticate = true
  },
  logout(state) {
    state.isAuthenticate = false
  },
  loginUser(state, u) {
    state.user.firstName = u.firstName
    state.user.secondName = u.lastName
    state.user.username = u.username
  }
}
