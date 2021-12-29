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

    <div class="mb-5 mt-5 flex justify-center">
      <div>
        <Link :href="(this.page > 1) ? `?page=${this.page - 1}` : ''"><ArrowCircleLeftIcon class="w-6" /></Link>
      </div>
      <div>
        <Link :href="(items.length > 0) ? `?page=${this.page + 1}` : ''"><ArrowCircleRightIcon class="w-6" /></Link>
      </div>
    </div>

    <Link href="/list"><button class="button-primary">Go Back.</button></Link>
  </div>
</template>

<script>
import Home from '../Layouts/Home';
import Title from '../Components/Title';
import { useForm, usePage, Link } from '@inertiajs/inertia-vue3';
import { ref } from 'vue';
import { ArrowCircleLeftIcon, ArrowCircleRightIcon } from '@heroicons/vue/outline';

export default {
  name: 'List',
  components: { Title, ArrowCircleLeftIcon, ArrowCircleRightIcon, Link },
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
    return {
      page: 1,
    };
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
  mounted() {
    this.getCurrentPage();
  },
  methods: {
    getCurrentPage() {
      let uri = window.location.search.substring(1);
      let params = new URLSearchParams(uri);
      this.page = parseInt(params.get('page')) || 1;
    },
  },
};
</script>

<style scoped></style>
