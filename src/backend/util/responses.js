const messageResponse = (message, success) => {
    return {
        success: success,
        msg: message
    }
}

const successResponse = (obj) => {
    if(typeof obj.toJSON === 'function') {
        return {
            success: true,
            ...obj.toJSON()
        }
    }
    return {
        success: true,
        ...obj
    }
}

const errorResponse = (message, code) => {
    return {
        success: false,
        error: "Something went wrong.",
        statusCode: code,
        msg: message
    }
}

const validationErrorResponse = (errors, code) => {
    return {
        success: false,
        error: "Validation Error.",
        statusCode: code,
        errors: errors
    }
}

const serverErrorResponse = errorResponse("Server error", 500);

module.exports = {
    messageResponse: messageResponse,
    successResponse: successResponse,
    errorResponse: errorResponse,
    validationErrorResponse: validationErrorResponse,
    serverErrorResponse: serverErrorResponse
}
