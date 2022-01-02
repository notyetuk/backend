<template>
  <div>
    <Title title="Your wishlists." />
    <div class="text-center">
      <button
        :class="addingList ? 'button-cancel' : 'button-success'"
        class="mb-5"
        @click="addingList = !addingList">
        {{ addingList ? 'Cancel' : 'Add a new List' }}
      </button>
      <div v-if="addingList">
        <form @submit.prevent="addList" class="mb-10 flex flex-col space-y-10 w-3/4 mx-auto">
          <div class="flex flex-col space-y-2">
            <input
              class="input"
              type="text"
              v-model="form.title"
              placeholder="List title."
              required />
            <input
              class="input"
              type="text"
              v-model="form.cover"
              placeholder="Link for a cover image."
              required />
            <button class="button-success" type="submit">Create List</button>
          </div>
        </form>
        <div class="w-3/4 mx-auto mb-10">
          <div class="flex flex-col space-y-2">
            <div>Search for an image to represent your list.</div>
            <ImageSearch @set-image="setImage" />
          </div>
        </div>
      </div>
      <ul class="text-center">
        <li
          v-for="item of lists"
          class="mb-3 text-xl border border-slate-200 rounded-md py-3 px-3 bg-white cursor-pointer hover:shadow-md ease-in-out duration-200 hover:-translate-y-[1px] relative">
          <div class="absolute right-3 top-2">
            <button
              type="button"
              @click="
                deleting = true;
                selected = item._id;
              "
              class="outline-none">
              <XCircleIcon class="w-4" />
            </button>
          </div>
          <a :href="'/list/' + item._id" class="flex align-middle items-center">
            <div class="w-1/4 mr-5">
              <img :src="item.cover" alt="image" />
            </div>
            <div class="w-full text-left">
              <!--              <ListItem :item="item" />-->
              <div>{{ item.title }}</div>
              <span class="text-sm">Created on {{ new Date(item.createdAt).toDateString() }}</span>
            </div>
          </a>
        </li>
      </ul>

      <div v-if="lists.length < 1">
        You have not created any lists yet. Go on and create a new wishlist.
      </div>
      <Modal v-if="deleting" @close-modal="deleting = false">
        <div class="text-lg">Do you really want to delete this list?</div>
        <div class="flex space-x-2 justify-center mt-4">
          <button type="button" class="button-success" @click="removeList">Yes</button>
          <button type="button" class="button-cancel" @click="deleting = false">No</button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import Home from '../Layouts/Layout';
import Title from '../Components/Title';
import ListItem from '../Components/ListItem';
import { useForm, usePage } from '@inertiajs/inertia-vue3';
import { ref } from 'vue';
import ImageSearch from '../Components/ImageSearch';
import { XCircleIcon } from '@heroicons/vue/outline';
import { Inertia } from '@inertiajs/inertia';
import Modal from '../Components/Modal';
import { UserStore } from '../Store/UserStore';

export default {
  name: 'Lists',
  components: { ImageSearch, ListItem, Title, XCircleIcon, Modal },
  layout: Home,
  props: {
    lists: {
      type: Array,
      default: [],
    },
    addingList: {
      type: Boolean,
      default: false,
    },
    deleting: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  setup(props, context) {
    if (!UserStore.userId) window.location = '/';

    const lists = ref(props.lists);
    const addingList = ref(props.addingList);
    const deleting = ref(props.deleting);
    const selected = ref(props.selected);
    const form = useForm({
      title: null,
      cover: null,
    });

    const addList = async () => {
      form.clearErrors();
      form.post('/list', {
        onSuccess: () => {
          form.reset();
          addingList.value = false;
          lists.value = usePage().props.value.lists;
        },
      });
    };

    const setImage = (url) => {
      console.log(url);
      form.cover = url;
    };

    const removeList = async () => {
      Inertia.delete(`/list/${selected.value}`, {
        onSuccess: () => {
          lists.value = usePage().props.value.lists;
          deleting.value = false;
        },
      });
    };

    return {
      form,
      lists,
      addList,
      addingList,
      setImage,
      removeList,
      deleting,
      selected,
    };
  },
};
</script>

<style scoped></style>
