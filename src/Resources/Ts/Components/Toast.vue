<template>
  <div class="absolute top-5 left-5 cursor-pointer" @click="closeToast">
    <div
      class="px-5 py-3 bg-opacity-75 border shadow-md"
      :class="
        type === 'info'
          ? info
          : '' || type === 'error'
          ? error
          : '' || type === 'success'
          ? success
          : ''
      ">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    type: {
      type: String,
      default: 'info',
    },
    message: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      error: 'bg-red-300 border-red-400 text-white',
      info: 'bg-sky-200 border-sky-300 text-slate-800',
      success: 'bg-green-300 border-green-400 text-slate-800',
    };
  },
  emits: ['close-toast'],
  methods: {
    closeToast() {
      this.$emit('close-toast');
    },
  },
  mounted() {
    setTimeout(() => {
      this.closeToast();
    }, 10000);
  },
};
</script>

<style scoped></style>
