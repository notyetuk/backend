<template>
  <div class="flex-col space-y-5">
    <div class="text-2xl">{{ item.title }}</div>
    <div>
      <img :src="item.image" alt="item image" />
    </div>
    <div>Added on {{ new Date(item.createdAt).toDateString() }}</div>
    <div class="flex justify-between">
      <div class="flex space-x-2">
        <a :href="item.url" target="_blank" class="button-primary cursor-pointer">Visit</a>
        <button class="button-cancel" type="button" @click="removeItem">Delete</button>
      </div>
      <div class="flex">
        <button class="button-plain" @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: ['item'],
  methods: {
    removeItem() {
      this.$emit('remove-item');
    },
    closeModal() {
      this.$emit('close-modal');
    },
  },
};
</script>

<style scoped></style>
