const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema cho Role
const roleSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// Tạo model Role
const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);

// Hàm để tạo các Role mặc định nếu chưa có
const createDefaultRoles = async () => {
  const roles = ['customer', 'merchant', 'admin']; // Các role cần tạo

  for (const roleName of roles) {
    const roleExists = await Role.findOne({ name: roleName });  // Kiểm tra nếu role đã tồn tại
    if (!roleExists) {
      const newRole = new Role({
        name: roleName,  // Tạo một role mới với tên
      });

      await newRole.save();
      console.log(`Default '${roleName}' role created successfully.`);
    } else {
      console.log(`Role '${roleName}' already exists.`);
    }
  }
};


mongoose.connection.on('connected', createDefaultRoles);

module.exports = Role;
