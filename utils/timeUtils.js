const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const toVietnamTime = (date) => {
    return date ? dayjs(date).tz('Asia/Ho_Chi_Minh').format() : null;
};

// ➕ Hàm mới: format dạng 'DD/MM/YYYY lúc HH:mm'
const formatVietnamDatetime = (date) => {
    return date
        ? dayjs(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY lúc HH:mm')
        : null;
};

module.exports = {
    toVietnamTime,
    formatVietnamDatetime
};