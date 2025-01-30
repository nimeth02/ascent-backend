const createResponse = (status, code, message, data = null, errors = null) => {
    const response = {
        status,
        code,
        message,
    };
    if (data) {
        response.data = data;
    }
    if (errors) {
        response.errors = errors;
    }
    return response;
};

module.exports = createResponse;