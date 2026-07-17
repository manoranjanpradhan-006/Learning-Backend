class ApiResponse {
    constructor(statusCode, data, Message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.Message = Message
        this.success = statusCode < 400
    }
}

export { ApiResponse }