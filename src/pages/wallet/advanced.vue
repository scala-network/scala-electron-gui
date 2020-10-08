<template>
  <q-page class="advanced-page">
    <div class="header row items-center justify-center q-pt-md">
      <q-btn-toggle
        v-model="screen"
        toggle-color="primary"
        color="secondary"
        :options="[
          { label: $t('titles.advanced.prove'), value: 'prove' },
          {
            label: $t('titles.advanced.checkTransaction'),
            value: 'check'
          }
        ]"
      />
    </div>
    <ProveTransaction v-if="screen === 'prove'" />
    <CheckTransaction v-if="screen === 'check'" />
  </q-page>
</template>

<script>
import ProveTransaction from "components/prove_transaction";
import CheckTransaction from "components/check_transaction";
export default {
  components: {
    ProveTransaction,
    CheckTransaction
  },
  data() {
    return {
      screen: "prove"
    };
  }
};
</script>

<style lang="scss"></style>
