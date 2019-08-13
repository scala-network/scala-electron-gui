<template>
<q-page>
    <div class="q-mx-md">
        <q-field class="q-mt-none">
            <q-input
                v-model="wallet.name"
                float-label="Wallet name"
                @blur="$v.wallet.name.$touch"
                :error="$v.wallet.name.$error"
                :dark="theme=='dark'"
                />
        </q-field>

        <q-field>
            <q-input
                v-model="wallet.address"
                float-label="Wallet address"
                @blur="$v.wallet.address.$touch"
                :error="$v.wallet.address.$error"
                :dark="theme=='dark'"
                />
        </q-field>

        <q-field>
            <q-input
                v-model="wallet.viewkey"
                float-label="Private viewkey"
                @blur="$v.wallet.viewkey.$touch"
                :error="$v.wallet.viewkey.$error"
                :dark="theme=='dark'"
                />
        </q-field>

        <q-field>
            <div class="row items-center gutter-sm">
                <div class="col">
                    <template v-if="wallet.refresh_type=='date'">
                        <q-datetime v-model="wallet.refresh_start_date" type="date"
                                    float-label="Restore from date"
                                    modal :min="1492486495000" :max="Date.now()"
                                    :dark="theme=='dark'"
                                    />
                    </template>
                    <template v-else-if="wallet.refresh_type=='height'">
                        <q-input v-model="wallet.refresh_start_height" type="number"
                                 min="0" float-label="Restore from block height"
                                 @blur="$v.wallet.refresh_start_height.$touch"
                                 :error="$v.wallet.refresh_start_height.$error"
                                 :dark="theme=='dark'"
                                 />
                    </template>
                </div>
                <div class="col-auto">
                    <template v-if="wallet.refresh_type=='date'">
                        <q-btn @click="wallet.refresh_type='height'" class="float-right" :text-color="theme=='dark'?'white':'dark'" flat>
                            <div style="width: 80px;" class="text-center">
                                <q-icon class="block" name="clear_all" />
                                <div style="font-size:10px">Switch to<br/>height select</div>
                            </div>
                        </q-btn>
                    </template>
                    <template v-else-if="wallet.refresh_type=='height'">
                        <q-btn @click="wallet.refresh_type='date'" class="float-right" :text-color="theme=='dark'?'white':'dark'" flat>
                            <div style="width: 80px;" class="text-center">
                                <q-icon class="block" name="today" />
                                <div style="font-size:10px">Switch to<br/>date select</div>
                            </div>
                        </q-btn>
                    </template>
                </div>
            </div>
        </q-field>

        <q-field>
            <q-input v-model="wallet.password" type="password" float-label="Password" :dark="theme=='dark'" />
        </q-field>

        <q-field>
            <q-input v-model="wallet.password_confirm" type="password" float-label="Confirm Password" :dark="theme=='dark'" />
        </q-field>

        <q-field>
            <q-btn color="primary" @click="restore_view_wallet" label="Restore view-only wallet" />
        </q-field>

    </div>
</q-page>
</template>

<script>
import { required, numeric } from "vuelidate/lib/validators"
import { privkey, address } from "src/validators/common"
import { mapState } from "vuex"
export default {
    data () {
        return {
            wallet: {
                name: "",
                address: "",
                viewkey: "",
                refresh_type: "date",
                refresh_start_height: 0,
                refresh_start_date: 1492486495000, // timestamp of block 1
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
            address: {
                required,
                isAddress(value) {
                    if (value === '') return true

                    return new Promise(resolve => {
                        address(value, this.$gateway)
                            .then(() => resolve(true))
                            .catch(e => resolve(false))
                    });
                }
            },
            viewkey: { required, privkey },
            refresh_start_height: { numeric }
        }
    },
    methods: {
        restore_view_wallet() {
            this.$v.wallet.$touch()

            if (this.$v.wallet.name.$error) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.enterWalletName")
                })
                return
            }
            if (this.$v.wallet.address.$error) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.invalidPublicAddress")
                })
                return
            }

            if (this.$v.wallet.viewkey.$error) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.invalidPrivateViewKey")
                })
                return
            }

            if (this.$v.wallet.refresh_start_height.$error) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.invalidRestoreHeight")
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

            this.$q.loading.show({
                delay: 0
            })

            this.$gateway.send("wallet", "restore_view_wallet", this.wallet);
        },
        cancel() {
            this.$router.replace({ path: "/wallet-select" });
        }
    }
}
</script>

<style>
</style>
