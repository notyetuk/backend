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
      <form v-if="addingList" @submit.prevent="addList" class="mb-5">
        <input type="text" v-model="form.title" placeholder="List title." />
        <button type="submit" hidden></button>
      </form>
      <ul class="text-center">
        <li v-for="item of lists" class="mb-3 text-xl">
          <ListItem :item="item" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Home from './Home';
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
