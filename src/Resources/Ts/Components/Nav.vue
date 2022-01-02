<template>
  <div v-if="user.userId" class="w-full bg-white px-10 py-2">
    <div class="w-[600px] flex items-center justify-between mx-auto">
      <div>Hello {{ user.username }}.</div>
      <button @click="logout" class="button-plain">Logout</button>
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
