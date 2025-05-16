const PaymentMethod = Object.freeze({
    ONLINE: { label: "online", value: "online" },
    COD: { label: "cod", value: "cod" },

    getValues() {
        return [
            this.ONLINE.value,
            this.COD.value
        ]
    }
})

module.exports = PaymentMethod