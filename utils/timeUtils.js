const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const toVietnamTime = (date) => {
    return date ? dayjs(date).tz('Asia/Ho_Chi_Minh').format() : null;
};


module.exports = { toVietnamTime }