<template>
  <div>
    {{ item.title }}<br />
    {{ item.url }}<br />
    {{ item.createdAt }}<br /><br />
    <button class="button-cancel" type="button" @click="removeItem">Delete</button>
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
  },
};
</script>

<style scoped></style>
