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
      <form
        v-if="addingList"
        @submit.prevent="addList"
        class="mb-5 flex flex-col space-y-2 w-3/4 mx-auto">
        <input type="text" v-model="form.title" placeholder="List title." required/>
        <input type="text" v-model="form.cover" placeholder="Link for a cover image." required/>
        <button type="submit" hidden></button>
      </form>
      <ul class="text-center">
        <li v-for="item of lists" class="mb-3 text-xl">
          <ListItem :item="item" />
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

export default {
  name: 'Lists',
  components: { ListItem, Title },
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

    return {
      form,
      lists,
      addList,
      addingList,
    };
  },
};
</script>

<style scoped></style>
