const { boolean } = require("joi");

// utils/joiMessages.js
const joiMessages = {

  string: {
    base: '{#label} phải là chuỗi',
    empty: '{#label} không được để trống',
    min: '{#label} phải có ít nhất {#limit} ký tự',
    max: '{#label} không được vượt quá {#limit} ký tự',
    pattern: '{#label} không đúng định dạng',
    email: '{#label} không đúng định dạng email',
    uri: '{#label} phải là liên kết hợp lệ'
  },
  number: {
    base: '{#label} phải là số',
    min: '{#label} phải lớn hơn hoặc bằng {#limit}',
    max: '{#label} phải nhỏ hơn hoặc bằng {#limit}',
    integer: '{#label} phải là số nguyên'
  },
  any: {
    only: '{#label} không đúng giá trị hợp lệ',
    invalid: '{#label} có giá trị không được phép',
    required: 'Trường {#label} là bắt buộc',
  },
  array: {
    base: '{#label} phải là mảng'
  },
  boolean: {
    base: '{#label} phải là là giá trị boolean'
  },
  date: {
    base: '{#label} phải là ngày hợp lệ (ISO 8601)',
    format: '{#label} phải là định dạng ISO 8601 (ví dụ: 2025-05-15T13:00:19.052Z)'
  }
};

module.exports = joiMessages;
