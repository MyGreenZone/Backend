const DeliveryMethod = Object.freeze({
    PICK_UP: { label: "Nhận tại cửa hàng", value: "pickup", shortLabel: 'Mang đi' },
    DELIVERY: { label: "Giao hàng tận nơi", value: "delivery", shortLabel: 'Giao hàng' },
    getShortLabelByValue(value) {
        const status = Object.values(this).find(status => status.value === value);
        return status ? status.shortLabel : "Không xác định";
    },

    getValues() {
        return [
            this.PICK_UP.value,
            this.DELIVERY.value
        ]
    },

    getLabels() {
        return [
            this.PICK_UP.label,
            this.DELIVERY.label
        ]
    }
});

module.exports = DeliveryMethod