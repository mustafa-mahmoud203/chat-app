import express, { NextFunction, Request, Response } from 'express';
declare function validationMiddleware(req: Request, res: Response, next: NextFunction): express.Response<any, Record<string, any>>;
export default validationMiddleware;
