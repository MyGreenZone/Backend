const ROLE = Object.freeze({
    CUSTOMER: 'customer',
    MERCHANT: 'merchant',
    ADMIN: 'admin',
    getRoles() {
        return [this.CUSTOMER, this.MERCHANT, this.ADMIN]
    }
})

module.exports = ROLE