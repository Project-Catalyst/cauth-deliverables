<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> cAuth Demo App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
        <sign-in-status />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header> Pages </q-item-label>
        <q-item to="/">Home Page</q-item>
        <q-item to="/secure">Secure Page</q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import SignInStatus from '../components/SignInStatus.vue';

const $q = useQuasar();

const leftDrawerOpen = ref(false);

if (!$q.sessionStorage.has('leftDrawerOpen')) {
  $q.sessionStorage.set('leftDrawerOpen', false);
} else {
  leftDrawerOpen.value = $q.sessionStorage.getItem('leftDrawerOpen') || false;
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
  $q.sessionStorage.set('leftDrawerOpen', leftDrawerOpen.value);
  console.log(
    'leftDrawerOpen',
    leftDrawerOpen.value,
    $q.sessionStorage.getItem('leftDrawerOpen')
  );
}
</script>
