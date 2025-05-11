const mongoose = require('mongoose')
const Schema = mongoose.Schema

const employeeSchema = new Schema({
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    gender: { type: String },
    phoneNumber: { type: String, require: true },
    avatar: { type: String, require: true },
    workingStore: { type: Schema.Types.ObjectId, ref: 'Store', require: true },
})

const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
module.exports = Employee;