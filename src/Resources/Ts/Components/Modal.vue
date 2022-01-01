<template>
  <div class="w-full h-full absolute bg-black left-0 top-0 bg-opacity-25 fixed p-4" id="back">
    <div
      class="w-full md:w-2/3 lg:w-2/4 bg-white rounded-md relative p-6 text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  beforeMount() {
    addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        this.closeModal();
      }
    });
    addEventListener('click', (ev) => {
      if (ev.target.id === 'back') {
        this.closeModal();
      }
    });
  },
  methods: {
    closeModal() {
      this.$emit('close-modal');
    },
  },
};
</script>

<style scoped></style>
