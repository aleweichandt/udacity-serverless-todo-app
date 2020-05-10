export interface HandledError extends Error {
    statusCode: number
    message: string
}

export class NotFoundError implements HandledError {
    name = 'Not Found'
    statusCode: number = 404
    message: string
    constructor(message: string) {
        this.message = message
    }
}

export class ForbiddenError implements HandledError {
    name = 'Forbidden'
    statusCode: number = 403
    message: string
    constructor(message: string) {
        this.message = message
    }
}