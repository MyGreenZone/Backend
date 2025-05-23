const OrderStatus = Object.freeze({
    AWAITING_PAYMENT: { label: "Chờ thanh toán", value: "awaitingPayment", position: 0 },
    PENDING_CONFIRMATION: { label: "Chờ xác nhận", value: "pendingConfirmation", position: 1 },
    PROCESSING: { label: "Đang chuẩn bị", value: "processing", position: 2 },
    READY_FOR_PICKUP: { label: "Chờ lấy hàng", value: "readyForPickup", position: 3 },
    SHIPPING_ORDER: { label: "Đang giao hàng", value: "shippingOrder", position: 4 },
    COMPLETED: { label: "Hoàn thành", value: "completed", position: 5 },
    CANCELLED: { label: "Đã hủy", value: "cancelled", position: 5 },
    FAILED_DELIVERY: { label: "Giao hàng thất bại", value: "failedDelivery", position: 5 },

    getPositionByValue(value) {
        const statuses = Object.values(this).filter(v => typeof v === 'object' && v.value);
        const status = statuses.find(v => v.value === value);
        return status ? status.position : 'Position not found';
    },


    getInProgressValues() {
        return [
            this.AWAITING_PAYMENT.value,
            this.PENDING_CONFIRMATION.value,
            this.PROCESSING.value,
            this.READY_FOR_PICKUP.value,
            this.SHIPPING_ORDER.value,
        ]
    },
    getCancelledValues() {
        return [
            this.CANCELLED.value,
            this.FAILED_DELIVERY.value
        ]
    },
    enableUpdateValues() {
        return [
            this.PROCESSING.value,
            this.READY_FOR_PICKUP.value,
            this.SHIPPING_ORDER.value,
            this.COMPLETED.value,
            this.CANCELLED.value,
            this.FAILED_DELIVERY.value
        ]
    },
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

