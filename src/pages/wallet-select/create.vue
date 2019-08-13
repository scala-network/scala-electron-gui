<template>
<q-page class="create-wallet">
    <div class="fields q-mx-md q-mt-md">
        <ScalaField :label="$t('fieldLabels.walletName')" :error="$v.wallet.name.$error">
            <q-input
                v-model="wallet.name"
                @keyup.enter="create"
                @blur="$v.wallet.name.$touch"
                :dark="theme=='dark'"
                :placeholder="$t('placeholders.walletName')"
                hide-underline
            />
        </ScalaField>

        <ScalaField :label="$t('fieldLabels.seedLanguage')">
            <q-select
                v-model="wallet.language"
                :options="languageOptions"
                :dark="theme=='dark'"
                hide-underline
            />
        </ScalaField>

        <ScalaField :label="$t('fieldLabels.password')" optional>
            <q-input
                v-model="wallet.password"
                @keyup.enter="create"
                type="password"
                :dark="theme=='dark'"
                :placeholder="$t('placeholders.walletPassword')"
                hide-underline
            />
        </ScalaField>

        <ScalaField :label="$t('fieldLabels.confirmPassword')">
            <q-input
                v-model="wallet.password_confirm"
                @keyup.enter="create"
                type="password"
                :dark="theme=='dark'"
                hide-underline
            />
        </ScalaField>

        <q-field>
            <q-btn color="primary" @click="create" :label="$t('buttons.createWallet')" />
        </q-field>

    </div>
</q-page>
</template>

<script>
import { required } from "vuelidate/lib/validators"
import { mapState } from "vuex"
import ScalaField from "components/scala_field"
export default {
    data () {
        return {
            wallet: {
                name: "",
                language: "English",
                password: "",
                password_confirm: ""
            },

            languageOptions: [

                {label: "English", value: "English"},
                {label: "Deutsch", value: "Deutsch"},
                {label: "Español", value: "Español"},
                {label: "Français", value: "Français"},
                {label: "Italiano", value: "Italiano"},
                {label: "Nederlands", value: "Nederlands"},
                {label: "Português", value: "Português"},
                {label: "Русский", value: "Русский"},
                {label: "日本語", value: "日本語"},
                {label: "简体中文 (中国)", value: "简体中文 (中国)"},
                {label: "Esperanto", value: "Esperanto"},
                {label: "Lojban", value: "Lojban"}

            ]
        }
    },
    computed: mapState({
        theme: state => state.gateway.app.config.appearance.theme,
        status: state => state.gateway.wallet.status,
    }),
    watch: {
        status: {
            handler(val, old){
                if(val.code == old.code) return
                switch(this.status.code) {
                    case 1:
                        break;
                    case 0:
                        this.$q.loading.hide()
                        this.$router.replace({ path: "/wallet-select/created" });
                        break;
                    default:
                        this.$q.loading.hide()
                        this.$q.notify({
                            type: "negative",
                            timeout: 1000,
                            message: this.status.message
                        })
                        break;
                }
            },
            deep: true
        }
    },
    validations: {
        wallet: {
            name: { required }
        }
    },
    methods: {
        create() {
            this.$v.wallet.$touch()

            if (this.$v.wallet.$error) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.enterWalletName")
                })
                return
            }
            if(this.wallet.password != this.wallet.password_confirm) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.passwordNoMatch")
                })
                return
            }

            // Warn user if no password is set
            let passwordPromise = Promise.resolve();
            if (!this.wallet.password) {
                passwordPromise = this.$q.dialog({
                    title: this.$t("dialog.noPassword.title"),
                    message: this.$t("dialog.noPassword.message"),
                    ok: {
                        label: this.$t("dialog.noPassword.ok"),
                    },
                    cancel: {
                        flat: true,
                        label: this.$t("dialog.buttons.cancel"),
                        color: this.theme === "dark" ? "white" : "dark"
                    },
                })
            }

            passwordPromise
                .then(() => {
                    this.$q.loading.show({
                        delay: 0
                    })
                    this.$gateway.send("wallet", "create_wallet", this.wallet)
                })
                .catch(() => {})
        },
        cancel() {
            this.$router.replace({ path: "/wallet-select" });
        }
    },
    components: {
        ScalaField
    }
}
</script>

<style lang="scss">
.create-wallet {
    .fields {
        > * {
            margin-bottom: 16px;
        }
    }
}
</style>
