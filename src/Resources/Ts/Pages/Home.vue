<template>
  <div class="flex justify-center">
    <div class="absolute w-full h-full md:w-2/3 lg:w-2/4">
      <slot />
    </div>
  </div>

</template>

<script>
export default {
  name: "Home",
  data() {
    return {
    }
  }
}
</script>

<style scoped>

</style>