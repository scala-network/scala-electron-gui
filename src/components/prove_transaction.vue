<template>
<div class="prove-transaction">
    <div class="q-pa-md">
        <div class="q-mb-lg description">
            {{ $t('strings.proveTransactionDescription') }}
        </div>
        <div>
            <ScalaField :label="$t('fieldLabels.transactionId')" :error="$v.txid.$error">
                <q-input v-model.trim="txid"
                    :dark="theme=='dark'"
                    :placeholder="$t('placeholders.pasteTransactionId')"
                    @blur="$v.txid.$touch"
                    hide-underline
                />
            </ScalaField>
            <ScalaField class="q-mt-md" :label="$t('fieldLabels.address')" :error="$v.address.$error" optional>
                <q-input v-model.trim="address"
                    :dark="theme=='dark'"
                    :placeholder="$t('placeholders.recipientWalletAddress')"
                    @blur="$v.address.$touch"
                    hide-underline
                />
            </ScalaField>
            <ScalaField class="q-mt-md" :label="$t('fieldLabels.message')" optional>
                <q-input v-model.trim="message"
                    :dark="theme=='dark'"
                    :placeholder="$t('placeholders.proveOptionalMessage')"
                    hide-underline
                />
            </ScalaField>
            <q-field class="buttons q-pt-sm">
                <q-btn color="primary" @click="generate" :label="$t('buttons.generate')" />
                <q-btn color="secondary" @click="clear" :label="$t('buttons.clear')" v-if="canClear"/>
                <q-btn color="secondary" @click="copy" :label="$t('buttons.copySignature')" v-if="status.state.signature"/>
            </q-field>
        </div>
        <div v-if="status.state.signature">
            <div class="txid q-mb-sm">
                <div class="title">{{ $t('strings.transactionID') }}</div>
                <div>{{ status.state.txid }}</div>
            </div>
            <p class="signature">
                {{ status.state.signature }}
            </p>
        </div>
    </div>
</div>
</template>

<script>
import { mapState } from "vuex"
import { required } from "vuelidate/lib/validators"
import { address } from "src/validators/common"
import ScalaField from "components/scala_field"
import { clipboard } from 'electron';

export default {
    name: "ProveTransaction",
    computed: mapState({
        theme: state => state.gateway.app.config.appearance.theme,
        status: state => state.gateway.prove_transaction_status,
        canClear () {
            return this.txid !== "" || this.address !== "" || this.message !== ""
        }
    }),
    data() {
        return {
            txid: "",
            address: "",
            message: "",
        }
    },
    validations: {
        txid: { required },
        address: {
            isAddress(value) {
                    if (value === '') return true

                    return new Promise(resolve => {
                        address(value, this.$gateway)
                            .then(() => resolve(true))
                            .catch(e => resolve(false))
                    });
                }
        }
    },
    watch: {
        status: {
            handler(val, old){
                if(val.code == old.code) return
                switch(this.status.code) {
                    case -1:
                        this.$q.notify({
                            type: "negative",
                            timeout: 3000,
                            message: this.status.message
                        })
                        break;
                }
            },
            deep: true
        },
    },
    methods: {
        generate() {
            this.$v.txid.$touch()
            this.$v.address.$touch()

            if (this.$v.txid.$error) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.enterTransactionId")
                })
                return
            }

            if (this.$v.address.$error) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: this.$t("notification.errors.invalidAddress")
                })
                return
            }

            this.$gateway.send("wallet", "prove_transaction", {
                txid: this.txid.trim(),
                address: this.address.trim(),
                message: this.message.trim()
            })
        },
        clear() {
            this.txid = ""
            this.address = ""
            this.message = ""
            this.$v.$reset();
        },
        copy() {
            clipboard.writeText(this.status.state.signature)
            this.$q.notify({
                type: "positive",
                timeout: 1000,
                message: this.$t("notification.positive.signatureCopied")
            })
        }
    },
    components: {
        ScalaField
    }
}
</script>


<style lang="scss">
.prove-transaction {
    .description {
        white-space: pre-line;
    }
    .buttons {
        .q-btn:not(:first-child) {
            margin-left: 8px;
        }
    }
    .signature {
        flex: 1;
        word-break: break-all;
        word-wrap: break-word;
        -webkit-user-select: all;
        user-select: all;
        padding: 8px;
    }
}
</style>
