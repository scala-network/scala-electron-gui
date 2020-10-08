<template>
  <q-page class="service-node-page">
    <div class="header row items-center justify-center q-pt-md">
      <q-btn-toggle
        v-model="screen"
        toggle-color="primary"
        color="secondary"
        :options="[
          {
            label: $t('titles.serviceNode.staking'),
            value: 'staking'
          },
          {
            label: $t('titles.serviceNode.registration'),
            value: 'registration'
          }
        ]"
      />
    </div>
    <ServiceNodeStaking v-if="screen === 'staking'" />
    <ServiceNodeRegistration v-if="screen === 'registration'" />
  </q-page>
</template>

<script>
import ServiceNodeStaking from "components/service_node_staking";
import ServiceNodeRegistration from "components/service_node_registration";
export default {
  components: {
    ServiceNodeStaking,
    ServiceNodeRegistration
  },
  data() {
    return {
      screen: "staking"
    };
  }
};
</script>

<style lang="scss"></style>
