
const Employee = require('../employee/employee.schema')
const Store = require('../store/store.schema')
const mongoose = require('mongoose')

const createEmployee = async (req, res) => {
    try {
        const {
            password,
            firstName,
            lastName,
            email,
            gender,
            phoneNumber,
            avatar,
            workingStore,
        } = req.body

        if (!password) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Password is required' });
        }

        if (password !== 'admin123') {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Wrong password' });
        }
        if (!mongoose.Types.ObjectId.isValid(workingStore)) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Sai định dạng working store' });
        }

        if (!lastName) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'lastName là bắt buộc' });
        }


        const store = await Store.findById(workingStore)
        if (!store) {
            return res.status(404).json({ statusCode: 404, success: false, message: 'Cửa hàng không tồn tại trong hệ thống' });
        }
        const employee = await Employee.findOne({ phoneNumber })
        if (employee) {
            return res.status(409).json({ statusCode: 409, success: false, message: 'Số điện thoại đã đăng ký trước đó' });
        }

        const newEmployee = await Employee.create({
            firstName,
            lastName,
            email,
            gender,
            phoneNumber,
            avatar,
            workingStore,
        })
        return res.status(201).json({ statusCode: 201, success: true, message: 'Created employee successfully', data: newEmployee });



    } catch (error) {
        console.log('Register error:', error);
        return res.status(500).json({ statusCode: 500, success: false, message: 'Internal server error' });
    }
}

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
        return res.status(200).json({ statusCode: 200, success: true, message: 'Get all employees successfully', data: employees });
    } catch (error) {
        console.log('getAllEmployees error:', error);
        return res.status(500).json({ statusCode: 500, success: false, message: 'Internal server error' });
    }
}

const getEmployeeDetail = async (req, res) => {
    try {
        const { employeeId } = req.params
        const employee = await Employee.findById(employeeId)
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Sai định dạng employeeId' });
        }
        return res.status(200).json({ statusCode: 200, success: true, message: 'Get employee detail successfully', data: employee });
    } catch (error) {
        console.log('Get employee detail error:', error);
        return res.status(500).json({ statusCode: 500, success: false, message: 'Internal server error' });
    }
}

const updateEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'ID nhân viên không hợp lệ' });
        }


        const { password, firstName, lastName, email, gender, avatar, workingStore } = req.body;
        if (!password) {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Password is required' });
        }

        if (password !== 'admin123') {
            return res.status(400).json({ statusCode: 400, success: false, message: 'Wrong password' });
        }
        // Kiểm tra lastName không được bỏ trống
        if (lastName === undefined || lastName.trim() === '') {
            return res.status(400).json({ statusCode: 400, success: false, message: 'lastName là bắt buộc' });
        }

        // Nếu có workingStore thì phải là ObjectId hợp lệ và tồn tại
        if (workingStore !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(workingStore)) {
                return res.status(400).json({ statusCode: 400, success: false, message: 'ID của cửa hàng không hợp lệ' });
            }

            const storeExists = await Store.findById(workingStore);
            if (!storeExists) {
                return res.status(404).json({ statusCode: 404, success: false, message: 'Cửa hàng không tồn tại' });
            }
        }

        // Xây dựng đối tượng cập nhật hợp lệ
        const updates = {};
        if (firstName !== undefined) updates.firstName = firstName;
        if (lastName !== undefined) updates.lastName = lastName;
        if (email !== undefined) updates.email = email;
        if (gender !== undefined) updates.gender = gender;
        if (avatar !== undefined) updates.avatar = avatar;
        if (workingStore !== undefined) updates.workingStore = workingStore;

        const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updates, {
            new: true,
            runValidators: true,
        });

        if (!updatedEmployee) {
            return res.status(404).json({ statusCode: 404, success: false, message: 'Không tìm thấy nhân viên' });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Cập nhật nhân viên thành công',
            data: updatedEmployee,
        });
    } catch (error) {
        console.error('Update error:', error);
        return res.status(500).json({ statusCode: 500, success: false, message: 'Lỗi server' });
    }
};

const getAvailableEmployees = async (req, res) => {

}


module.exports = { createEmployee, getAllEmployees, getEmployeeDetail, updateEmployee, getAvailableEmployees }