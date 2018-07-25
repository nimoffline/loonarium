<template>
  <div class="login-box">
    <form @submit.prevent="submit">
      <input
        class="login-field"
        type="text"
        v-model="username"
        placeholder="username"
      />
      <input
        class="login-field"
        type="password"
        v-model="password"
        placeholder="password"
      />
      <br/>
      <button
        class="login-button"
        type="submit"
      >Login</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'login-box',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    submit () {
      const data = {
        username: this.username,
        password: this.password
      }
      this.$store.dispatch('auth/login', data)
    }
  }
}
</script>

<style lang="scss">
.login-box {
  color: black;
  padding-top: 20px;
}

.login-field {

}

.login-button {
}
</style>
