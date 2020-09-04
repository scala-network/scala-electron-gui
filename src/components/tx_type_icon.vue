<template>
  <div v-if="type == 'in'" class="tx-icon">
    <q-icon name="call_received" size="40px" class="main-icon" />
  </div>
  <div v-else-if="type == 'out'" class="tx-icon">
    <q-icon name="call_made" size="40px" class="main-icon" />
  </div>
  <div v-else-if="type == 'pool'" class="tx-icon">
    <q-icon name="call_received" size="40px" class="main-icon" />
    <q-icon name="access_time" size="14px" class="sub-icon" />
  </div>
  <div v-else-if="type == 'pending'" class="tx-icon">
    <q-icon name="call_made" size="40px" class="main-icon" />
    <q-icon name="access_time" size="14px" class="sub-icon" />
  </div>
  <div v-else-if="type == 'failed'" class="tx-icon">
    <q-icon name="close" size="40px" class="main-icon" color="red" />
  </div>
</template>

<script>
export default {
  name: "TxTypeIcon",
  props: {
    type: {
      type: String,
      required: true
    },
    tooltip: {
      type: Boolean,
      default: true,
      required: false
    }
  }
};
</script>

<style>
.tx-icon {
  width: 32px;
  height: 32px;
  position: relative;
}
.tx-icon .main-icon {
  margin: -4px 0 0 -4px;
}
.tx-icon .sub-icon {
  width: 14px;
  height: 14px;
  position: absolute;
  bottom: -3px;
  right: 0;
}
</style>
