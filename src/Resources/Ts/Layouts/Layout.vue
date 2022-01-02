<template>
  <Nav />
  <div class="flex justify-center">
    <div class="w-full h-full md:w-2/3 lg:w-2/4 p-4">
      <slot />
    </div>
  </div>
</template>

<script>
import { usePage } from '@inertiajs/inertia-vue3';
import { UserStore } from '../Store/UserStore';
import Nav from '../Components/Nav';

export default {
  name: 'Home',
  components: { Nav },
  data() {
    return {};
  },
  setup(props, context) {
    if (usePage().props.value.user) {
      UserStore.userId = usePage().props.value.user._id;
      UserStore.username = usePage().props.value.user.username;
    }
  },
};
</script>

<style scoped></style>
