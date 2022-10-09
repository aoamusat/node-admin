import { Response, Request } from "express";

export const Handle404 = (req: Request, res: Response, next: Function) => {
	console.log(req);
};
