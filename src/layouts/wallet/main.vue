<template>
<q-layout view="hHh Lpr lFf">
    <q-layout-header class="shift-title">
        <main-menu />
        <q-toolbar-title>
            <div class="flex items-center justify-center" style="margin-top:7px">
                <img src="statics/scala.svg" height="32">
            </div>
        </q-toolbar-title>
    </q-layout-header>

    <q-page-container>
        <!-- <AddressHeader :address="info.address" :title="info.name" /> -->
        <WalletDetails />

        <div class="app-content">
            <div class="navigation row items-end">
                <router-link to="/wallet">
                    <q-btn
                        class="single-icon"
                        size="md"
                        icon="swap_horiz"
                    />
                </router-link>
                <router-link to="/wallet/send">
                    <q-btn
                        class="large-btn"
                        :label="$t('buttons.send')"
                        size="md"
                        icon-right="arrow_right_alt"
                        align="left"
                    />
                </router-link>
                <router-link to="/wallet/receive">
                    <q-btn
                        class="large-btn"
                        :label="$t('buttons.receive')"
                        size="md"
                        icon-right="save_alt"
                        align="left"
                    />
                </router-link>

                </router-link>
                <router-link to="/wallet/advanced">
                    <q-btn
                        class="large-btn"
                        :label="$t('buttons.advanced')"
                        size="md"
                        icon-right="tune"
                        align="left"
                    />
                </router-link>
                <router-link to="/wallet/addressbook" class="address">
                    <q-btn
                        class="single-icon"
                        size="md"
                        icon="person"
                    />
                </router-link>

            </div>
            <div class="hr-separator" />
            <keep-alive>
                <router-view />
            </keep-alive>
        </div>
    </q-page-container>

    <status-footer />

</q-layout>
</template>

<script>
const { clipboard } = require("electron")
import { openURL } from "quasar"
import { mapState } from "vuex"
import WalletDetails from "components/wallet_details"
import FormatScala from "components/format_scala"
import StatusFooter from "components/footer"
import MainMenu from "components/mainmenu"
export default {
    name: "LayoutDefault",
    computed: mapState({
        theme: state => state.gateway.app.config.appearance.theme,
        info: state => state.gateway.wallet.info,
    }),
    data() {
        return {
            selectedTab: "tab-1",
        }
    },
    methods: {
        openURL,
    },
    components: {
        StatusFooter,
        MainMenu,
        WalletDetails
    }
}
</script>

<style lang="scss">
.navigation {
    padding: 8px 12px;

    > * {
        margin: 2px 0;
        margin-right: 12px;
    }

    > *:last-child {
        margin-right: 0px;
    }

    .address {
        margin-left: auto;
    }

    .single-icon {
        width: 38px;
        padding: 0;
    }

    .large-btn {
        min-width: 160px;
        .q-btn-inner > *:last-child {
            margin-left: auto;
            padding-left: 8px;
        }

    }
}

</style>
