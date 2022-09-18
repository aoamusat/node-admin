import { verify } from "jsonwebtoken";
import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/User";

export const AuthMiddlware = async (
	req: Request,
	res: Response,
	next: Function
) => {
	try {
		const jwt: string = req.cookies.jwt;
		const payload: any = verify(jwt, process.env.SECRET_KEY);
		if (!payload) {
			return res.status(403).json({
				message: "Unauthenticated!",
			});
		}

		const repository = getManager().getRepository(User);

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
