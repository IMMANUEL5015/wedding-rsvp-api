import type {Request, Response, NextFunction} from 'express';

const CatchAsync =  (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return fn(req, res, next).catch(next);
    }
}

export default CatchAsync