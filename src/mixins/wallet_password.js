import { mapState } from "vuex"

export default {
    computed: mapState({
        theme: state => state.gateway.app.config.appearance.theme
    }),
    methods: {
        hasPassword () {
            // Validate the address
            return new Promise((resolve) => {
                this.$gateway.once("has_password", (data) => {
                    resolve(!!data)
                })
                this.$gateway.send("wallet", "has_password")
            })
        },

        showPasswordConfirmation (options) {
            const { noPasswordMessage, ...other } = options

            return this.hasPassword().then(hasPassword => {
                return this.$q.dialog({
                    cancel: {
                        flat: true,
                        label: this.$t("dialog.buttons.cancel"),
                        color: this.theme === "dark" ? "white" : "dark"
                    },
                    ...other,
                    message: hasPassword ? this.$t("dialog.password.message") : noPasswordMessage,
                    prompt: hasPassword ? {
                        model: "",
                        type: "password"
                    } : null
                })
            }).then(password => password || "")
        }
    }
}
