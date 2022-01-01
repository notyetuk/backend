<template>
  <input class="input" type="text" v-model="keyword" />
  <button type="button" @click="searchImage" class="button-primary">search</button>
  <Modal v-show="hasResults" @close-modal="hasResults = !hasResults">
    <ul class="flex flex-wrap justify-between">
      <li v-for="image of imageResults" @click="setImage(image.largeImageURL)">
        <img :src="image.previewURL" alt="image" />
      </li>
    </ul>
  </Modal>
</template>

<script>
import axios from 'axios';
import Modal from './Modal';

const apiKey = '25044598-7d63f9b21102c02fd138317db';

export default {
  name: 'ImageSearch',
  components: { Modal },
  emits: ['set-image'],
  data() {
    return {
      apiKey: apiKey,
      keyword: '',
      hasResults: false,
      imageResults: [],
    };
  },
  methods: {
    async searchImage() {
      axios
        .get(`https://pixabay.com/api/?key=${this.apiKey}&q=${this.keyword}`)
        .then((response) => {
          this.hasResults = true;
          this.imageResults = response.data.hits;
          // showResults.value = true;
        });
    },
    setImage(url) {
      this.$emit('set-image', url);
      this.hasResults = false;
    },
  },
};
</script>

<style scoped></style>
