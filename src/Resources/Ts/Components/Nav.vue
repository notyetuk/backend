<template>
  <div>
    <div v-if="user.userId">
      {{ user.username }}
      <button @click="logout" class="button-cancel">Logout</button>
    </div>
  </div>
</template>

<script>
import { UserStore } from '../Store/UserStore';
import { Inertia } from '@inertiajs/inertia';

export default {
  name: 'Nav',
  data() {
    return {
      user: UserStore,
    };
  },
  setup(props, context) {
    const logout = () => {
      Inertia.get('/logout');
    };

    return {
      logout,
    };
  },
};
</script>

<style scoped></style>
