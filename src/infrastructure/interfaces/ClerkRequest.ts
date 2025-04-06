import { Request } from 'express'

export interface ClerkRequest extends Request {
    auth: any
}