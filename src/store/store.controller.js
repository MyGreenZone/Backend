const Store = require('./store.schema');
const mongoose = require('mongoose');
const { KEY } = require('../../constants')


const createStore = async (req, res) => {
    try {
        const { password, name, phoneNumber, images, openTime, closeTime, address, latitude, longitude } = req.body;

        if (!password) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Password is required' });
        }

        if (password !== KEY.ADMIN_PASSWORD) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Wrong password' });
        }


        let store = await Store.findOne({ phoneNumber });
        if (store) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'Số điện thoại này đã đăng ký Store trước đó',

            });
        }

        store = await Store.create({ name, phoneNumber, images, openTime, closeTime, address, latitude, longitude });
        return res.status(201).json({
            statusCode: 201,
            success: true,
            message: 'Store created successfully',
            data: store
        });

    } catch (error) {
        console.log('Create store error:', error);
        return res.status(500).json({ statusCode: 500, success: false, message: 'Internal server error' });
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
            statusCode: 200,
            success: true,
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
        return res.status(500).json({ statusCode: 500, success: false, message: 'Internal server error' });
    }
};

const getStoreDetail = async (req, res) => {
    try {
        const { storeId } = req.params;

        if (!storeId) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'StoreId is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Invalid storeId' });
        }

        const store = await Store.findById(storeId);

        if (!store) {
            return res.status(404).json({ statusCode: 404, success: false, message: 'Store not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Get store detail successfully',
            data: store,
            statusCode: 200
        });

    } catch (error) {
        console.error('Get store detail error:', error);
        return res.status(500).json({ statusCode: 500, success: false, message: 'Internal server error' });
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
            return res.status(400).json({ statusCode: 400, success: false, message: 'Password is required' });
        }

        if (password !== KEY.ADMIN_PASSWORD) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Wrong password' });
        }

        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Invalid storeId' });
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
            return res.status(404).json({ statusCode: 404, success: false, message: 'Store not found' });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Store updated successfully',
            data: store,
        });

    } catch (error) {
        console.log('Update store error:', error);
        return res.status(500).json({ statusCode: 500, success: false, message: 'Internal server error' });
    }
};


module.exports = { createStore, getAllStores, getStoreDetail, updateStore };
