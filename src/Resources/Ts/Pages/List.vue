<template>
  <Head>
    <title>{{ list.title }}</title>
  </Head>
  <Toast
    :message="toastMessage"
    :type="toastType"
    v-if="showToast"
    @close-toast="showToast = false" />
  <div class="text-center">
    <!--    <div-->
    <!--      :style="`background-image: url(${list.cover})`"-->
    <!--      class="w-full bg-cover bg-center h-80 pt-40"-->
    <!--      v-if="!addingItem">-->
    <!--      <Title :title="list.title" />-->
    <!--    </div>-->
    <Title :title="list.title" />
  </div>
  <div class="text-center mt-5">
    <button
      :class="addingItem ? 'button-cancel' : 'button-success'"
      class="mb-5"
      @click="addingItem = !addingItem">
      {{ !addingItem ? 'Add a new Item.' : 'Cancel' }}
    </button>

    <div v-if="addingItem">
      <form @submit.prevent="addItem" class="mb-10 flex flex-col space-y-10 w-3/4 mx-auto">
        <div class="space-y-2 flex flex-col">
          <input
            type="text"
            v-model="form.title"
            class="w-full input"
            placeholder="Enter your item name here."
            required />
          <input
            type="text"
            v-model="form.url"
            class="w-full input"
            placeholder="Enter your item url here. (online store url)"
            required />
          <input
            type="text"
            v-model="form.image"
            class="w-full input"
            placeholder="Image url. (can be your own)"
            required />
          <input type="text" v-model="form.list" hidden />
          <button class="button-success" type="submit">Add</button>
        </div>
      </form>
      <div class="w-3/4 mx-auto mb-10">
        <div class="flex flex-col space-y-2">
          <div>Search for an image to represent your item or use your own.</div>
          <ImageSearch @set-image="setImage" />
        </div>
      </div>
    </div>
    <ul class="flex flex-wrap justify-between space-y-2">
      <li v-for="image of imageResults">
        <img :src="image.previewURL" alt="image" @click="setImage(image.largeImageURL)" />
      </li>
    </ul>

    <ul v-if="items.length > 0">
      <li
        v-for="item of items"
        class="mb-3 text-xl border border-slate-200 rounded-md py-3 px-3 bg-white cursor-pointer hover:shadow-md ease-in-out duration-200 hover:-translate-y-[1px] relative"
        @click="setItem(item)">
        <!--        <a :href="item.url" target="_blank">-->
        <div class="flex w-full">
          <div class="w-1/4 mr-5">
            <img :src="item.image" alt="item image" />
          </div>
          <div class="flex flex-col text-left">
            <div class="text-lg">{{ item.title }}</div>
            <div class="text-sm">Added on {{ new Date(item.createdAt).toDateString() }}</div>
            <!--            <button class="absolute right-2 top-2" @click="removeItem(item._id)">-->
            <!--              <XCircleIcon class="w-5" />-->
            <!--            </button>-->
          </div>
        </div>
        <!--        </a>-->
      </li>
    </ul>
    <div v-if="items.length === 0">No items on this list.</div>

    <Modal v-if="showItem" @close-modal="showItem = false">
      <Item :item="currentItem.value" @remove-item="removeItem(currentItem.value._id)" />
    </Modal>

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
import Home from '../Layouts/Layout';
import Title from '../Components/Title';
import { useForm, usePage, Link, Head } from '@inertiajs/inertia-vue3';
import { ref } from 'vue';
import { ArrowCircleLeftIcon, ArrowCircleRightIcon, XCircleIcon } from '@heroicons/vue/outline';
import { Inertia } from '@inertiajs/inertia';
import Modal from '../Components/Modal';
import axios from 'axios';
import { UserStore } from '../Store/UserStore';
import ImageSearch from '../Components/ImageSearch';
import Toast from '../Components/Toast';
import Item from '../Components/Item';

export default {
  name: 'List',
  components: {
    Item,
    Toast,
    ImageSearch,
    Modal,
    Title,
    ArrowCircleLeftIcon,
    ArrowCircleRightIcon,
    XCircleIcon,
    Link,
    Head,
  },
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
    showToast: {
      type: Boolean,
      default: false,
    },
    toastMessage: {
      type: String,
      default: '',
    },
    toastType: {
      type: String,
      default: 'info',
    },
    showItem: {
      type: Boolean,
      default: false,
    },
    currentItem: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      page: 1,
      pageSize: 8,
    };
  },
  setup(props, context) {
    if (!UserStore.userId) window.location = '/';

    const items = ref(props.items);
    const imageResults = ref(props.imageResults);
    const showResults = ref(props.showResults);
    const showToast = ref(props.showToast);
    const toastMessage = ref(props.toastMessage);
    const toastType = ref(props.toastType);
    let keyword = {
      v: null,
    };
    const showItem = ref(props.showItem);
    const currentItem = {};

    const form = useForm({
      title: null,
      list: props.list._id,
      image: null,
      url: null,
    });

    const addItem = async () => {
      form.clearErrors();
      form.post('/item', {
        onSuccess: () => {
          form.reset();
          items.value = usePage().props.value.items;
          imageResults.value = [];
          showToast.value = true;
          toastType.value = 'success';
          toastMessage.value = 'Item added to the list';
        },
      });
    };

    const removeItem = async (id) => {
      Inertia.delete(`/item/d?list=${props.list._id}&id=${id}`, {
        // Inertia.delete(`/item/d/${props.list._id}/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          items.value = usePage().props.value.items;
          showToast.value = true;
          toastType.value = 'success';
          toastMessage.value = 'Item removed from the list';
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

    const setItem = (item) => {
      showItem.value = true;
      currentItem.value = item;
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
      toastMessage,
      showToast,
      toastType,
      showItem,
      setItem,
      currentItem,
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
