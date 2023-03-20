<template>
  <q-page padding>
    <h4 class="text-weight-bold text-center">Creating Personal Credentials</h4>
    <q-breadcrumbs align="left">
      <q-breadcrumbs-el label="Home" to="/" />
      <q-breadcrumbs-el label="Personal Login" />
    </q-breadcrumbs>
    <p class="text-caption text-justify q-py-md">
      Personal Credentials are no yet available. Please check back later or
      subscribe to our newsletter to be notified when they are available.
    </p>
    <div class="flex flex-center column">
      <q-form @submit="subscribe()">
      <q-input
        outlined
        v-model="email"
        label="Email"
        type="email"
        lazy-rules
        :rules="[(val) => validateEmail(val) || 'Please enter a valid email']"
      />
      <q-btn
        class="cyan-6"
        type="submit"
        label="Subscribe to newsletter"
      />
    </q-form>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PersonalLogin',
  components: {},
  methods: {
    subscribe() {
      console.log('Not subscribing to notifications email', this.email);
      this.$router.push('/');
      return true
    },
    validateEmail(email: string) {
      return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);
    },
  },
  setup() {
    const email = ref<string>('');
    return { email };
  },
});
</script>
