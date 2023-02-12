<template>
  <div 
    class="d-flex justify-content-center mt-4"
  >
    <b-spinner
      variant="primary"
      :class="{ spinner: !small }"
    />
  </div>
</template>

<script>
export default {
  name: 'DefaultSpinner',
  props: {
    small: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style scoped>
.spinner {
  width: 100px;
  height: 100px;
}
</style>