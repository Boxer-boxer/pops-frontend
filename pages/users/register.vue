<template>
  <div>
    <h1>This will be the Register page</h1>
    <form>
      <h3>userName:</h3>
      <input v-model="register.username" type="name" name="username" />

      <h3>password:</h3>
      <input v-model="register.password" type="password" name="password" />

      <h3>email:</h3>
      <input v-model="register.email" type="email" name="email" />

      <button @click="createUser()">CreateUser</button>
    </form>

    <nuxt-link to="/users">Login Page</nuxt-link>
    <nuxt-link to="/">Back to index </nuxt-link>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      register: {
        username: null,
        password: null,
        email: null
      }
    }
  },
  methods: {
    async createUser(username, password, email) {
      const userObj = {
        username: this.register.username,
        password: this.register.password,
        email: this.register.email
      }
      await axios
        .post(`${process.env.API_URL}/api/users`, userObj)
        .then((res) => console.log(res))
    }
  }
}
</script>
<style></style>
