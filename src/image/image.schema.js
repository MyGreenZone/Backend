const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { MODEL_NAMES } = require('../../constants')
const imageSchema = new Schema({
    url: { type: String, required: true }
}, {
    timestamps: true
})

const Image = mongoose.models.Image || mongoose.model(MODEL_NAMES.IMAGE, imageSchema);
module.exports = Image;