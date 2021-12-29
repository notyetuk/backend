<template>
  <div class="text-center">
    <div
      :style="`background-image: url(${list.cover})`"
      class="w-full bg-cover bg-center h-80 pt-40">
      <Title :title="list.title" />
      <form @submit.prevent="addItem" class="mb-5">
        <input type="text" v-model="form.title" />
        <input type="text" v-model="form.list" hidden />
        <button type="submit" hidden>Add</button>
      </form>
    </div>
  </div>
  <div class="text-center mt-5">
    <ul v-if="items.length > 0">
      <li v-for="item of items" class="mb-5">
        <div class="flex flex-col w-full">
          <div class="text-lg">{{ item.title }}</div>
          <div class="text-sm">{{ new Date(item.createdAt).toDateString() }}</div>
          <button class="absolute right-0" @click="removeItem(item._id)">
            <XCircleIcon class="w-5" />
          </button>
        </div>
      </li>
    </ul>
    <div v-if="items.length === 0">No items on this list.</div>

    <div class="mb-5 mt-5 flex justify-center">
      <div>
        <Link v-show="this.page > 1" :href="`?page=${this.page - 1}`">
          <ArrowCircleLeftIcon class="w-6" />
        </Link>
      </div>
      <div>
        <Link v-show="items.length > 0" :href="`?page=${this.page + 1}`">
          <ArrowCircleRightIcon class="w-6" />
        </Link>
      </div>
    </div>

    <Link href="/list">
      <button class="button-primary">Go Back.</button>
    </Link>
  </div>
</template>

<script>
import Home from '../Layouts/Home';
import Title from '../Components/Title';
import { useForm, usePage, Link } from '@inertiajs/inertia-vue3';
import { ref } from 'vue';
import { ArrowCircleLeftIcon, ArrowCircleRightIcon, XCircleIcon } from '@heroicons/vue/outline';
import { Inertia } from '@inertiajs/inertia';

export default {
  name: 'List',
  components: { Title, ArrowCircleLeftIcon, ArrowCircleRightIcon, XCircleIcon, Link },
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

    const removeItem = async (id) => {
      Inertia.delete(`/item/del/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          console.log('deleted.');
          items.value = usePage().props.value.items;
        }
      });
    }

    return {
      form,
      addItem,
      items,
      removeItem
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
