const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {MODEL_NAMES, ROLE} = require('../../constants')
const employeeSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String },
    phoneNumber: { type: String, required: true },
    avatar: { type: String, required: true },
    password: {type: String, required: true, default: '123456' },
    workingStore: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.STORE },
    role: {type: String, enum: ROLE.getEmployeeRoles(), default: ROLE.STAFF.value}
})

const Employee = mongoose.models.Employee || mongoose.model(MODEL_NAMES.EMPLOYEE, employeeSchema);
module.exports = Employee;