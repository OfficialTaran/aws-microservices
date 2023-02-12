<template>
  <div 
    class="d-flex w-100"
    :class="{ 'my-2' : writable }"
  >
    <div class="label mr-3">{{ label }}:</div>
    <b-skeleton 
      v-if="loading" 
      class="flex-fill"
    />
    <b-form-input
      v-else-if="writable"
      :value="value"
      :type="input_type"
      @update="value => $emit('input', value)"
    />
    <div v-else>{{ value }}</div>
  </div>
</template>

<script>

export default {
  name: 'ModalInput',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    writable: {
      type: Boolean,
      default: false
    },
    input_type: {
      type: String,
      default: 'text'
    }
  }
}
</script>