<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Welcome back!</h2>

          {{ error }}

          <form method="post" @submit.prevent="login">
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input type="text" class="input" name="email" v-model="email" />
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  type="password"
                  class="input"
                  name="password"
                  v-model="password"
                />
              </div>
            </div>
            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">
                Log In
              </button>
            </div>
          </form>
          <div class="has-text-centered" style="margin-top: 20px">
            <p>
              Don't have an account?
              <nuxt-link to="/register">Register</nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  computed: {
    isUserOn() {
      return this.$store.state.authentication.isAuthenticate
    },
    user() {
      return this.$store.state.authentication.user
    }
  },
  mounted() {
    console.log(this.isUserOn)
    console.log(this.user)
    if (this.isUserOn) {
      this.$router.push('/')
    }
  },
  methods: {
    createLogin(res) {
      this.$store.commit('authentication/login')
      this.$store.commit('authentication/loginUser', res)
      console.log(res)
    },
    async login() {
      // this.$store.commit('authentication/login')
      // console.log(this.isUserOn)
      const data = { Username: this.email, Password: this.password }

      try {
        await axios
          .post(`${process.env.API_URL}/users/authenticate`, data)
          .then((res) => this.createLogin(res.data))
          .then(this.$router.push('/'))
      } catch (e) {
        this.error = e
      }
    }
  }
}
/* try {
        await this.$auth.loginWith('local', {
          data: {
            username: 'jorg11edasilvarodrigues92@gmail.com',
            password: 'boxer92'
          }
        })
        // do something on success
      } catch (e) {
        // do something on failure
      } */

/*

        /*
        await this.$auth.loginWith('local', {
          data: {
            Username: this.email,
            Password: this.password
          }
        })
     */
/*
        this.$router.push('/')

    }
  }
} */
</script>
