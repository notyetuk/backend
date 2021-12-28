<template>
  <div>
    <a :href="'/list/' + item._id">{{ item.title }}</a>
  </div>
</template>

<script>
export default {
  name: 'ListItem',
  props: ['item'],
  data() {
    return {};
  },
};
</script>

<style scoped></style>
