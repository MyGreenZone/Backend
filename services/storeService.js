const Store = require('../models/store');
const mongoose = require('mongoose');

const createStore = async (req, res) => {
    try {
        const { password, name, phoneNumber, images, openTime, closeTime, address, latitude, longitude } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required', statusCode: 400 });
        }

        if (password !== 'admin123') {
            return res.status(400).json({ success: false, message: 'Wrong password', statusCode: 400 });
        }

        let store = await Store.findOne({ phoneNumber });
        if (store) {
            return res.status(400).json({
                success: false,
                message: 'Số điện thoại này đã đăng ký Store trước đó',
                statusCode: 400
            });
        }

        store = await Store.create({ name, phoneNumber, images, openTime, closeTime, address, latitude, longitude });
        return res.status(201).json({
            success: true,
            message: 'Store created successfully',
            data: store,
            statusCode: 201
        });

    } catch (error) {
        console.log('Create store error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', statusCode: 500 });
    }
};

const getAllStores = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalDocs = await Store.countDocuments();
        const totalPages = Math.ceil(totalDocs / limit);

        const docs = await Store.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            statusCode: 200,
            data: {
                page,
                limit,
                totalDocs,
                totalPages,
                docs
            }
        });
    } catch (error) {
        console.log('Get all stores error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', statusCode: 500 });
    }
};

const getStoreDetail = async (req, res) => {
    try {
        const { storeId } = req.params;

        if (!storeId) {
            return res.status(400).json({ success: false, message: 'StoreId is required', statusCode: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ success: false, message: 'Invalid storeId', statusCode: 400 });
        }

        const store = await Store.findById(storeId);

        if (!store) {
            return res.status(404).json({ success: false, message: 'Store not found', statusCode: 404 });
        }

        return res.status(200).json({
            success: true,
            message: 'Get store detail successfully',
            data: store,
            statusCode: 200
        });

    } catch (error) {
        console.error('Get store detail error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', statusCode: 500 });
    }
};

const updateStore = async (req, res) => {
    try {
        const { storeId } = req.params;
        const {
            password,
            name,
            phoneNumber,
            images,
            openTime,
            closeTime,
            address,
            latitude,
            longitude
        } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required', statusCode: 400 });
        }

        if (password !== 'admin123') {
            return res.status(400).json({ success: false, message: 'Wrong password', statusCode: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ success: false, message: 'Invalid storeId', statusCode: 400 });
        }

        const store = await Store.findByIdAndUpdate(
            storeId,
            {
                ...(name && { name }),
                ...(phoneNumber && { phoneNumber }),
                ...(images && { images }),
                ...(openTime && { openTime }),
                ...(closeTime && { closeTime }),
                ...(address && { address }),
                ...(latitude && { latitude }),
                ...(longitude && { longitude }),
            },
            { new: true }
        );

        if (!store) {
            return res.status(404).json({ success: false, message: 'Store not found', statusCode: 404 });
        }

        return res.status(200).json({
            success: true,
            message: 'Store updated successfully',
            data: store,
            statusCode: 200
        });

    } catch (error) {
        console.log('Update store error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', statusCode: 500 });
    }
};


module.exports = { createStore, getAllStores, getStoreDetail, updateStore };
