<template>
  <Title :title="list.title" />
  <div class="text-center">
    <form @submit.prevent="addItem" class="mb-5">
      <input type="text" v-model="form.title" />
      <input type="text" v-model="form.list" hidden />
      <button type="submit" hidden>Add</button>
    </form>
    <ul v-if="items.length > 0">
      <li v-for="item of items" class="mb-5">
        <div class="flex flex-col">
          <div class="text-lg">{{ item.title }}</div>
          <div class="text-sm">{{ new Date(item.createdAt).toDateString() }}</div>
        </div>
      </li>
    </ul>
    <div v-if="items.length === 0">No items on this list.</div>

    <button class="button-primary" @click="goBack">Go Back.</button>
  </div>
</template>

<script>
import Home from './Home';
import Title from '../Components/Title';
import { useForm, usePage } from '@inertiajs/inertia-vue3';
import { ref } from 'vue';

export default {
  name: 'List',
  components: { Title },
  layout: Home,
  props: {
    list: {
      type: Object,
      default: {},
    },
    items: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {};
  },
  setup(props, context) {
    const items = ref(props.items);

    const form = useForm({
      title: null,
      list: props.list._id,
    });

    const addItem = async () => {
      form.clearErrors();
      form.post('/item', {
        onSuccess: () => {
          form.reset();
          items.value = usePage().props.value.items;
        },
      });
    };

    return {
      form,
      addItem,
      items,
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
  },
};
</script>

<style scoped></style>
