<template>
  <!-- Add a new item modal -->
  <Modal v-show="addingItem" @close-modal="addingItem = false">
    <Title title="Adding a new item." />
    <form @submit.prevent="addItem" class="mb-5">
      <input
        type="text"
        v-model="form.title"
        class="w-full mb-5 input"
        placeholder="Enter your list name here." />
      <input
        type="text"
        v-model="form.image"
        class="w-full mb-5 input"
        placeholder="Image url. (can be your own)" />
      <input type="text" v-model="form.list" hidden />
      <button class="button-primary" type="submit">Add</button>
    </form>
    <form class="mb-5" @submit.prevent="searchImage">
      <input
        type="text"
        class="w-full input"
        v-model="keyword.v"
        placeholder="Write keywords to find a suitable image." />
    </form>
    <ul class="flex flex-wrap justify-between space-y-2">
      <li v-for="image of imageResults">
        <img :src="image.previewURL" alt="image" @click="setImage(image.largeImageURL)" />
      </li>
    </ul>
  </Modal>

  <div class="text-center">
    <div
      :style="`background-image: url(${list.cover})`"
      class="w-full bg-cover bg-center h-80 pt-40">
      <Title :title="list.title" />
    </div>
  </div>
  <div class="text-center mt-5">
    <button class="button-success mb-5" @click="addingItem = !addingItem">Add a new item.</button>
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
      <div v-if="this.page > 1">
        <Link :href="`?page=${this.page - 1}`">
          <ArrowCircleLeftIcon class="w-6" />
        </Link>
      </div>
      <div v-show="items.length > 0">
        <Link :href="`?page=${this.page + 1}`">
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
import Modal from '../Components/Modal';
import axios from 'axios';

export default {
  name: 'List',
  components: { Modal, Title, ArrowCircleLeftIcon, ArrowCircleRightIcon, XCircleIcon, Link },
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
    addingItem: {
      type: Boolean,
      default: false,
    },
    pixabayKey: {
      type: String,
      default: '',
    },
    imageResults: {
      type: Array,
      default: [],
    },
    showResults: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      page: 1,
      pageSize: 8,
    };
  },
  setup(props, context) {
    const items = ref(props.items);
    const imageResults = ref(props.imageResults);
    const showResults = ref(props.showResults);
    let keyword = {
      v: null,
    };

    const form = useForm({
      title: null,
      list: props.list._id,
      image: keyword.v,
    });

    const addItem = async () => {
      form.clearErrors();
      form.post('/item', {
        onSuccess: () => {
          form.reset();
          items.value = usePage().props.value.items;
          imageResults.value = [];
        },
      });
    };

    const removeItem = async (id) => {
      Inertia.delete(`/item/del/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          console.log('deleted.');
          items.value = usePage().props.value.items;
        },
      });
    };

    const searchImage = async () => {
      axios
        .get(`https://pixabay.com/api/?key=${props.pixabayKey}&q=${keyword.v}`)
        .then((response) => {
          imageResults.value = response.data.hits;
          showResults.value = true;
        });
    };

    const setImage = (url) => {
      form.image = url;
    };

    return {
      form,
      addItem,
      items,
      removeItem,
      searchImage,
      imageResults,
      keyword,
      showResults,
      setImage,
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
