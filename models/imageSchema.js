const mongoose = require("mongoose")
const Schema = mongoose.Schema

const imageSchema = new Schema({
    url: { type: String, required: true }
}, {
    timestamps: true
})

const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);
module.exports = Image;