import { verify } from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../db/data-source";

/**
 * Verify if the user making the request is authenticated
 *
 * @param req Request
 * @param res Response
 * @param next Funtion
 * @returns Promise<Response<any, Record<string, any>>>
 */
export const AuthMiddlware = async (
	req: Request,
	res: Response,
	next: Function
): Promise<Response<any, Record<string, any>>> => {
	try {
		const jwt: string = req.cookies.jwt;
		const payload: any = verify(jwt, process.env.SECRET_KEY);
		if (!payload) {
			return res.status(403).json({
				message: "Unauthenticated!",
			});
		}

		const repository = AppDataSource.getRepository(User);

		const user = await repository.findOneBy({
			id: payload.id,
		});

		req["user"] = user;

		next();
	} catch (e) {
		return res.status(403).json({
			message: "Unauthenticated!",
		});
	}
};
