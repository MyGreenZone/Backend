function success(statusCode, message, data = null) {
    return {
        statusCode,
        success: true,
        message,
        data
    };
}

function error(statusCode, message) {
    return {
        statusCode,
        success: false,
        message
    };
}

module.exports = { success, error };
