<template>
<div class="column wallet-info">
    <div class="row justify-between items-center wallet-header scala-green">
        <div class="title">{{ info.name }}</div>
        <WalletSettings />
    </div>
    <div class="wallet-content">
        <div class="row justify-center">
            <div class="funds column items-center">
                <div class="balance">
                    <div class="text"><span>{{ $t("strings.scalaBalance") }}</span></div>
                    <div class="value"><span><FormatScala :amount="info.balance" /></span></div>
                </div>
                <div class="row unlocked">
                    <span>{{ $t("strings.scalaUnlockedShort") }}: <FormatScala :amount="info.unlocked_balance" /></span>
                </div>
            </div>
        </div>
        <div class="wallet-address row justify-center items-center">
            <div class="address">{{ info.address }}</div>
            <q-btn
            color="primary" style="width:25px;"
            size="sm" icon="file_copy"
            ref="copy"
            @click="copyAddress">
            <q-tooltip anchor="center right" self="center left" :offset="[5, 10]">
                {{ $t("menuItems.copyAddress") }}
            </q-tooltip>
        </q-btn>
        </div>
    </div>
</div>
</template>

<script>
const { clipboard } = require("electron")
import { mapState } from "vuex"
import FormatScala from "components/format_scala"
import WalletSettings from "components/wallet_settings"
export default {
    name: "WalletDetails",
    computed: mapState({
        theme: state => state.gateway.app.config.appearance.theme,
        info: state => state.gateway.wallet.info,
    }),
    methods: {
        copyAddress () {
            this.$refs.copy.$el.blur()
            clipboard.writeText(this.info.address)
            this.$q.notify({
                type: "positive",
                timeout: 1000,
                message: this.$t("notification.positive.addressCopied")
            })
        },
    },
    components: {
        FormatScala,
        WalletSettings
    },
}
</script>

<style lang="scss">
.wallet-info {
    .wallet-header {
        padding: 0.8rem 1.5rem;
        .title {
            font-weight: bold;
        }
    }

    .wallet-content {
        text-align: center;
        background-color: #0A0A0A;
        padding: 2em;

        .balance {
            .text {
                font-size: 16px;
            }
            .value {
                font-size: 35px;
            }
        }

         .wallet-address {
            margin-top: 12px;
            .address {
                overflow: hidden;
                text-overflow: ellipsis;
                margin: 4px 0;
            }
            .q-btn {
                margin-left: 8px;
            }
        }

        .unlocked {
            font-size: 14px;
            font-weight: 500;
        }
    }
}
</style>

