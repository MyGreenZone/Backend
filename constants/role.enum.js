const ROLE = Object.freeze({
    CUSTOMER: { label: 'Khách hàng', value: 'customer' },
    STAFF: { label: 'Nhân viên thường', value: 'staff' },
    ADMIN: { label: 'Quản trị viên', value: 'admin' },
    getRoles() {
        return [this.CUSTOMER.value, this.STAFF.value, this.ADMIN.value]
    },
    getEmployeeRoles() {
        return [this.STAFF.value, this.ADMIN.value]
    }
})

module.exports = ROLE