const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {MODEL_NAMES} = require('../../constants')
const employeeSchema = new Schema({
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    gender: { type: String },
    phoneNumber: { type: String, require: true },
    avatar: { type: String, require: true },
    workingStore: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.STORE, require: true },
})

const Employee = mongoose.models.Employee || mongoose.model(MODEL_NAMES.EMPLOYEE, employeeSchema);
module.exports = Employee;