import * as express from 'express';

declare module 'express-serve-static-core' {
    export interface Request {
        user?: any; // Use a specific type here, e.g., 'User'
    }
}
