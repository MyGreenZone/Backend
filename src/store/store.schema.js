const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    name: {
        type: String,
        default: 'GreenZone Tô Ký'
    },
    phoneNumber: {
        type: String,
        required: true
    },
    images: {
        type: [String], // Danh sách URL hình ảnh
        default: []
    },
    openTime: {
        type: String, // Định dạng HH:mm:ss
        required: true
    },
    closeTime: {
        type: String, // Định dạng HH:mm:ss
        required: true
    },
    address: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Store = mongoose.models.Store || mongoose.model("Store", storeSchema);
module.exports = Store;
