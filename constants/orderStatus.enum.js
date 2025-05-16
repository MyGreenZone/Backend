const OrderStatus = Object.freeze({
    AWAITING_PAYMENT: { label: "Chờ thanh toán", value: "awaitingPayment" },
    PENDING_CONFIRMATION: { label: "Chờ xác nhận", value: "pendingConfirmation" },
    PROCESSING: { label: "Đang chuẩn bị", value: "processing" },
    READY_FOR_PICKUP: { label: "Chờ lấy hàng", value: "readyForPickup" },
    SHIPPING_ORDER: { label: "Đang giao hàng", value: "shippingOrder" },
    COMPLETED: { label: "Hoàn thành", value: "completed" },
    CANCELLED: { label: "Đã hủy", value: "cancelled" },
    FAILED_DELIVERY: { label: "Giao hàng thất bại", value: "failedDelivery" },

    getValues() {
        return [
            this.AWAITING_PAYMENT.value,
            this.PENDING_CONFIRMATION.value,
            this.PROCESSING.value,
            this.READY_FOR_PICKUP.value,
            this.SHIPPING_ORDER.value,
            this.COMPLETED.value,
            this.CANCELLED.value,
            this.FAILED_DELIVERY.value
        ]
    },
    getLabelByValue(value) {
        const status = Object.values(this).find(status => status.value === value);
        return status ? status.label : "Không xác định";
    },

    getLabels() {
        return [
            this.AWAITING_PAYMENT.label,
            this.PENDING_CONFIRMATION.label,
            this.PROCESSING.label,
            this.READY_FOR_PICKUP.label,
            this.SHIPPING_ORDER.label,
            this.COMPLETED.label,
            this.CANCELLED.label,
            this.FAILED_DELIVERY.label
        ]
    }
});

module.exports = OrderStatus

