type status = "success" | "fail" | undefined;
type data = unknown | undefined;

class AppError extends Error {
    status: status
    statusCode: number;
    data: data;

    constructor(
        message: string, statusCode: number, 
        data?: data, status?: status,
    ) {
        super(message);

        this.status = status;
        this.statusCode = statusCode;
        this.data = data;
    }
}

export default AppError;