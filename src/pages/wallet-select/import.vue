<template>
<q-page>
    <div class="q-mx-md import-wallet">

        <ScalaField :label="$t('fieldLabels.newWalletName')" :error="$v.wallet.name.$error">
            <q-input
                v-model="wallet.name"
                :placeholder="$t('placeholders.walletName')"
                @keyup.enter="import_wallet"
                @blur="$v.wallet.name.$touch"
                :dark="theme=='dark'"
                hide-underline
                />
        </ScalaField>

        <ScalaField :label="$t('fieldLabels.walletFile')" disable-hover :error="$v.wallet.path.$error">
            <q-input
                v-model="wallet.path"
                :placeholder="$t('placeholders.selectAFile')"
                disable
                :dark="theme=='dark'"
                hide-underline
            />
            <input type="file" id="walletPath" v-on:change="setWalletPath" ref="fileInput" hidden />
            <q-btn
                color="secondary"
                :label="$t('buttons.selectWalletFile')"
                v-on:click="selectFile"
                :text-color="theme=='dark'?'white':'dark'"
            />
        </ScalaField>

        <ScalaField :label="$t('fieldLabels.password')">
            <q-input
                v-model="wallet.password"
                :placeholder="$t('placeholders.walletPassword')"
                @keyup.enter="import_wallet"
                type="password"
                :dark="theme=='dark'"
                hide-underline
            />
        </ScalaField>

        <ScalaField :label="$t('fieldLabels.confirmPassword')">
            <q-input
                v-model="wallet.password_confirm"
                @keyup.enter="import_wallet"
                type="password"
                :dark="theme=='dark'"
                hide-underline
            />
        </ScalaField>

        <q-field>
            <q-btn color="primary" @click="import_wallet" :label="$tc('buttons.importWallet', 1)" />
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
                path: "",
                password: "",
                password_confirm: ""
            },
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
            name: { required },
            path: { required }
        }
    },
    methods: {
        selectFile () {
            this.$refs.fileInput.click()
        },
        setWalletPath (file) {
            this.wallet.path = file.target.files[0].path
        },
        import_wallet() {
            this.$v.wallet.$touch()

            if (this.$v.wallet.name.$error) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.enterWalletName")
                })
                return
            }

            if (this.$v.wallet.path.$error) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.selectWalletFile")
                })
                return
            }

            if (this.wallet.password != this.wallet.password_confirm) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.passwordNoMatch")
                })
                return
            }

            this.$q.loading.show({
                delay: 0
            })

            this.$gateway.send("wallet", "import_wallet", this.wallet);
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
.import-wallet {
    .q-if-disabled {
        cursor: default !important;
        .q-input-target {
            cursor: default !important;
        }
    }

    .scala-field {
        margin-top: 16px;
    }
}
</style>
