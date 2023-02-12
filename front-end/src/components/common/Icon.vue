<template>
  <div
    v-b-tooltip.hover
    :title="tooltip"
  >
    <b-icon
      class="mx-1 clickable"
      :variant="variant"
      :icon="icon"
      :font-scale="scale"
      :shift-v="shift_v"
      :shift-h="shift_h"
      @click="$emit('click')"
    />
  </div>
</template>

<script>
export default {
  name: 'DefaultIcon',
  props: {
    tooltip: {
      type: String,
      default: ''
    },
    variant: {
      type: String,
      default: 'dark'
    },
    icon: {
      type: String,
      default: 'exclamation-circle-fill'
    },
    scale: {
      type: String,
      default: '1'
    },
    shift_v: {
      type: String,
      default: '0'
    },
    shift_h : {
      type: String,
      default: '0'
    }
  }
}
</script>