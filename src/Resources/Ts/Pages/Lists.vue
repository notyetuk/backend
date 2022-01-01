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
          class="mb-3 text-xl border border-slate-400 rounded-md py-3 px-3 bg-white cursor-pointer hover:shadow-md ease-in-out duration-200 hover:-translate-y-[1px]">
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
    </div>
  </div>
</template>

<script>
import Home from '../Layouts/Home';
import Title from '../Components/Title';
import ListItem from '../Components/ListItem';
import { useForm, usePage } from '@inertiajs/inertia-vue3';
import { ref } from 'vue';
import ImageSearch from '../Components/ImageSearch';

export default {
  name: 'Lists',
  components: { ImageSearch, ListItem, Title },
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
  },
  data() {
    return {};
  },
  setup(props, context) {
    const lists = ref(props.lists);
    const addingList = ref(props.addingList);
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

    return {
      form,
      lists,
      addList,
      addingList,
      setImage,
    };
  },
};
</script>

<style scoped></style>
