<template>
<q-page class="welcome">

    <q-stepper class="no-shadow" ref="stepper" :color="theme == 'dark' ? 'light' : 'dark'" dark @step="onStep">

        <q-step default :title="$t('titles.welcome')" class="first-step">

            <div class="welcome-container">
                <img src="statics/scala.svg" height="100" class="q-mb-md">
                <div>Wallet Version: v{{version}}</div>
                <div>Deamon Version: v{{daemonVersion}}</div>

                <language-select
                    class="q-mt-lg"
                    v-on:select="onLanguageSelected"
                />
            </div>

        </q-step>

        <q-step :title="$t('titles.configure')">
            <SettingsGeneral randomise_remote ref="settingsGeneral" />
        </q-step>
    </q-stepper>

     <q-layout-footer v-if="!is_first_page" class="no-shadow q-pa-sm">
        <div class="row justify-end">
            <div>
                <q-btn
                    flat
                    @click="clickPrev()"
                    :label="$t('buttons.back')"
                    />
            </div>
            <div>
                <q-btn
                    class="q-ml-sm"
                    color="primary"
                    @click="clickNext()"
                    :label="$t('buttons.next')"
                    />
            </div>
        </div>
    </q-layout-footer>

</q-page>
</template>

<script>
import { version } from "../../../package.json"
import { mapState } from "vuex"
import LanguageSelect from "components/language_select"
import SettingsGeneral from "components/settings_general"

export default {
    computed: mapState({
        theme: state => state.gateway.app.config.appearance.theme,
        pending_config: state => state.gateway.app.pending_config,
        config_daemon (state) {
            return this.pending_config.daemons[this.pending_config.app.net_type]
        },
        daemon: state => state.gateway.daemon,
        daemonVersion (state) {
            return this.daemon.info.version || 'N/A'
        }
    }),
    data() {
        return {
            is_first_page: true,
            version: "",
        }
    },
    mounted () {

        this.version = version

        // set add status back to 2
        this.$store.commit("gateway/set_app_data", {
            status: {
                code: 2 // Loading config
            }
        });
    },
    methods: {
        onStep () {
            this.is_first_page = this.$refs.stepper.steps[0].active
        },
        clickNext () {
            if(this.$refs.stepper.steps[this.$refs.stepper.length-1].active) {
                this.$gateway.send("core", "save_config_init", this.pending_config);
                this.$router.replace({ path: "/" });
            } else {
                this.$refs.stepper.next();
            }
        },
        clickPrev () {
            this.$refs.stepper.previous();
        },
        onLanguageSelected (lang) {
            this.clickNext()
        }
    },
    components: {
        LanguageSelect,
        SettingsGeneral
    }
}
</script>

<style lang="scss">

.welcome {
    .welcome-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .first-step .q-stepper-step-inner {
        min-height: 250px;
        height: calc(100vh - 102px);
    }
}

.language-item {

    padding: 10px 30px 10px 20px;
    border: 1px solid #ccc;
    cursor: pointer;


    .language-item-circle {
        background: #cc90e2;
        width: 50px;
        height: 50px;
        border-radius: 25px;
        display: inline-block;
        line-height: 50px;
        text-align:center;
        color: white;
        margin-right: 10px;
    }
}

.q-stepper-header {
    min-height: 50px;

    .q-stepper-tab {
        padding-top: 0;
        padding-bottom: 0;
    }

}
</style>
