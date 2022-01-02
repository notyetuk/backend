<template>
  <div v-if="!isLoggedIn" class="text-center">
    <div class="mb-10">
      <span
        @click="
          _login = true;
          _register = false;
        "
        class="cursor-pointer"
        >Login</span
      >
      |
      <span
        @click="
          _register = true;
          _login = false;
        "
        class="cursor-pointer"
        >Register</span
      >
    </div>
    <div v-if="_login">
      <div class="text-lg mb-5">Login</div>
      <form @submit.prevent="login" class="w-2/4 mx-auto flex flex-col space-y-2">
        <input type="text" class="input" placeholder="Username" v-model="form.username" />
        <input type="text" class="input" placeholder="Password" v-model="form.password" />
        <button type="submit" class="button-primary">Login</button>
      </form>
    </div>

    <div v-if="_register">
      <div class="text-lg mb-5">Register</div>
      <form @submit.prevent="register" class="w-2/4 mx-auto flex flex-col space-y-2">
        <input type="text" class="input" placeholder="Username" v-model="form.username" />
        <input type="password" class="input" placeholder="Password" v-model="form.password" />
        <!--      <input-->
        <!--        type="password"-->
        <!--        class="input"-->
        <!--        placeholder="Verify Password"-->
        <!--        v-model="form.passwordConfirm" />-->
        <button type="submit" class="button-primary">Register</button>
      </form>
    </div>
  </div>
</template>

<script>
import Layout from '../Layouts/Layout';
import { useForm, usePage } from '@inertiajs/inertia-vue3';
import { ref } from 'vue';
import { Inertia } from '@inertiajs/inertia';
import { UserStore } from '../Store/UserStore';
import Nav from '../Components/Nav';

export default {
  name: 'Home',
  components: { Nav },
  layout: Layout,
  props: {
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      user: UserStore,
      _login: true,
      _register: false,
    };
  },
  setup(props, context) {
    const isLoggedIn = ref(props.isLoggedIn);

    if (usePage().props.value.user) {
      isLoggedIn.value = true;
    }

    const form = useForm({
      username: null,
      password: null,
      // passwordConfirm: null,
    });

    const login = async () => {
      form.post('/login', {
        onSuccess: (r) => {
          console.log(r);
        },
        onError: (r) => {
          console.log(r);
        },
      });
      form.reset();
    };

    const register = async () => {
      form.post('/register');
      form.reset();
    };

    const logout = async () => {
      Inertia.get('/logout');
    };

    return {
      form,
      login,
      register,
      isLoggedIn,
      logout,
    };
  },
};
</script>

<style scoped></style>
