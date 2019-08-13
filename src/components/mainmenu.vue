<template>
<div>
    <q-btn class="menu" icon="menu" size="md" flat>
        <q-popover>
            <q-list separator link>
                <q-item v-close-overlay @click.native="switchWallet" v-if="!disableSwitchWallet">
                    <q-item-main>
                        <q-item-tile label>{{ $t("menuItems.switchWallet") }}</q-item-tile>
                    </q-item-main>
                </q-item>
                <q-item v-close-overlay @click.native="openSettings">
                    <q-item-main>
                        <q-item-tile label>{{ $t("menuItems.settings") }}</q-item-tile>
                    </q-item-main>
                </q-item>
                <q-item v-close-overlay @click.native="showAbout(true)">
                    <q-item-main>
                        <q-item-tile label>{{ $t("menuItems.about") }}</q-item-tile>
                    </q-item-main>
                </q-item>
                <q-item v-close-overlay @click.native="exit">
                    <q-item-main>
                        <q-item-tile label>{{ $t("menuItems.exit") }}</q-item-tile>
                    </q-item-main>
                </q-item>
            </q-list>
        </q-popover>

    </q-btn>
    <settings-modal ref="settingsModal" />
    <q-modal minimized ref="aboutModal">
        <div class="about-modal">

            <img class="q-mb-md" src="statics/scala.svg" height="42" />

            <p class="q-my-sm">Wallet Version: v{{version}}</p>
            <p class="q-my-sm">Deaemon Version: v{{daemonVersion}}</p>
            <p class="q-my-sm">Copyright (c) 2019, Scala Network</p>
            <p class="q-my-sm">Copyright (c) 2018-2019, Loki Network</p>
            <p class="q-my-sm">Copyright (c) 2018, Ryo Currency Project</p>
            <p class="q-my-sm">All rights reserved.</p>

            <div class="q-mt-md q-mb-lg external-links">
                <p>
                    <a @click="openExternal('https://scalaproject.io/')" href="#">https://scalaproject.io/</a>
                </p>
                <p>
                    <a @click="openExternal('https://discord.gg/QfCWRfx')" href="#">Discord</a> -
                    <a @click="openExternal('https://www.reddit.com/r/ScalaNetwork/')" href="#">Reddit</a> -
                    <a @click="openExternal('https://github.com/scala-network/')" href="#">Github</a>
                </p>
            </div>

            <q-btn
                color="primary"
                @click="showAbout(false)"
                label="Close"
                />
        </div>
    </q-modal>
</div>
</template>

<script>
import { version } from "../../package.json"
import { mapState } from "vuex"
import SettingsModal from "components/settings"
export default {
    name: "MainMenu",
    props: {
        disableSwitchWallet: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    computed: mapState({
        theme: state => state.gateway.app.config.appearance.theme,
        isRPCSyncing: state => state.gateway.wallet.isRPCSyncing,
        daemon: state => state.gateway.daemon,
        daemonVersion (state) {
            return this.daemon.info.version || 'N/A'
        }
    }),
    data() {
        return {
            version: "",
        }
    },
    mounted () {
        this.version = version
    },
    methods: {
        openExternal (url) {
            this.$gateway.send("core", "open_url", {url})
        },
        showAbout (toggle) {
            if(toggle)
                this.$refs.aboutModal.show()
            else
                this.$refs.aboutModal.hide()
        },
        openSettings () {
            this.$refs.settingsModal.isVisible = true
        },
        switchWallet () {
            // If the rpc is syncing then we want to tell the user to restart
            if (this.isRPCSyncing) {
                this.$gateway.confirmClose(this.$t("dialog.switchWallet.restartMessage"), true)
                return
            }

            // Allow switching normally because rpc won't be blocked
            this.$q.dialog({
                title: this.$t("dialog.switchWallet.title"),
                message: this.$t("dialog.switchWallet.closeMessage"),
                ok: {
                    label: this.$t("dialog.buttons.ok")
                },
                cancel: {
                    flat: true,
                    label: this.$t("dialog.buttons.cancel"),
                    color: this.theme=="dark"?"white":"dark"
                }
            }).then(() => {
                this.$router.replace({ path: "/wallet-select" })
                this.$gateway.send("wallet", "close_wallet")
                setTimeout(() => {
                    // short delay to prevent wallet data reaching the
                    // websocket moments after we close and reset data
                    this.$store.dispatch("gateway/resetWalletData")
                }, 250);
            }).catch(() => {
            })
        },
        exit () {
            this.$gateway.confirmClose(this.$t("dialog.exit.message"))
        }
    },
    components: {
        SettingsModal
    }
}
</script>

<style lang="scss">
.about-modal {

    padding: 25px;

    .external-links {

        a {

            color: #497dc6;
            text-decoration: none;

            &:hover,
            &:active,
            &:visited {
                text-decoration: underline;
            }

        }

    }

}

</style>
