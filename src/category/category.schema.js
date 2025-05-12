// category.schema.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { MODEL_NAMES } = require('../../constants')
const categorySchema = new Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true }
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model(MODEL_NAMES.CATEGORY, categorySchema)
module.exports = Category