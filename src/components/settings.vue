<template>
<q-modal v-model="isVisible" maximized class="settings-modal">
    <q-modal-layout>
        <q-toolbar slot="header" color="dark" inverted>
            <q-btn flat round dense @click="isVisible = false" icon="reply" />
            <q-toolbar-title shrink>
                {{ $t("titles.settings.title") }}
            </q-toolbar-title>

            <div class="row col justify-center q-pr-xl">
                <q-btn-toggle
                    v-model="page"
                    toggle-color="primary"
                    color="tertiary"
                    size="md"
                    :options="tabs"
                    />
            </div>

            <q-btn color="primary" @click="save" :label="$t('buttons.save')" />
        </q-toolbar>

        <div v-if="page=='general'">
            <div class="q-pa-lg">
                <SettingsGeneral ref="settingsGeneral"></SettingsGeneral>
            </div>
        </div>

        <div v-if="page=='peers'">
            <q-list :dark="theme=='dark'" no-border>
                <q-list-header>{{ $t("strings.peerList") }}</q-list-header>

                <q-item link v-for="(entry, index) in daemon.connections" @click.native="showPeerDetails(entry)">
                    <q-item-main>
                        <q-item-tile label>{{ entry.address }}</q-item-tile>
                        <q-item-tile sublabel>{{ $t("strings.blockHeight") }}: {{ entry.height }}</q-item-tile>
                    </q-item-main>
                </q-item>

                <template v-if="daemon.bans.length">

                    <q-list-header>{{ $t("strings.bannedPeers.title") }}</q-list-header>
                    <q-item v-for="(entry, index) in daemon.bans">
                        <q-item-main>
                            <q-item-tile label>{{ entry.host }}</q-item-tile>
                            <q-item-tile sublabel>{{ $t("strings.bannedPeers.bannedUntil", { time: new Date(Date.now() + entry.seconds * 1000).toLocaleString() }) }}</q-item-tile>
                        </q-item-main>
                    </q-item>

                </template>

            </q-list>

        </div>

        <div v-if="page === 'language'">
            <language-select />
        </div>

    </q-modal-layout>

</q-modal>
</template>

<script>
import { mapState } from "vuex"
import SettingsGeneral from "components/settings_general"
import LanguageSelect from "components/language_select"

export default {
    name: "SettingsModal",
    computed: mapState({
        theme: state => state.gateway.app.config.appearance.theme,
        daemon: state => state.gateway.daemon,
        pending_config: state => state.gateway.app.pending_config,
        config: state => state.gateway.app.config,
        tabs: function(state) {
            const { app, daemons } = state.gateway.app.config;
            let tabs = [
                { label: this.$t("titles.settings.tabs.general"), value: 'general', icon: 'settings' },
                { label: this.$t("titles.settings.tabs.language"), value: 'language', icon: 'language' },
            ]
            if(daemons[app.net_type].type != 'remote') {
                tabs.push({ label: this.$t("titles.settings.tabs.peers"), value: 'peers', icon: 'cloud_queue' })
            }
            return tabs
        }
    }),
    data () {
        return {
            page: "general",
            isVisible: false
        }
    },
    watch: {
        isVisible: function () {
            if(this.isVisible == false) {
                this.$store.dispatch("gateway/resetPendingConfig")
            }
        }
    },
    methods: {
        save() {
            this.$gateway.send("core", "save_config", this.pending_config);
            this.isVisible = false
        },
        showPeerDetails (entry) {
            this.$q.dialog({
                title: this.$t("dialog.banPeer.peerDetailsTitle"),
                message: JSON.stringify(entry, null, 2),
                ok: {
                    label: this.$t("dialog.banPeer.ok"),
                    color: "negative",
                },
                cancel: {
                    flat: true,
                    label: "Close",
                    color: this.theme=="dark"?"white":"dark"
                }
            }).then(() => {

                this.$q.dialog({
                    title: this.$t("dialog.banPeer.title"),
                    message: this.$t("dialog.banPeer.message"),
                    prompt: {
                        model: "",
                        type: "number"
                    },
                    ok: {
                        label: this.$t("dialog.banPeer.ok"),
                        color: "negative"
                    },
                    cancel: {
                        flat: true,
                        label: this.$t("dialog.buttons.cancel"),
                        color: this.theme=="dark"?"white":"dark"
                    }
                }).then(seconds => {
                    this.$gateway.send("daemon", "ban_peer", {host: entry.host, seconds})
                }).catch(() => {

                })
            }).catch(() => {

            })
        }
    },
    components: {
        LanguageSelect,
        SettingsGeneral
    }
}
</script>

<style lang="scss">
</style>
