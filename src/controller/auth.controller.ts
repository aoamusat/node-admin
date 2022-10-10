import { Request, Response } from "express";
import { User } from "../entity/User";
import { RegisterValidation } from "../validation/register.validation";
import { hash, compare } from "bcryptjs";
import { LoginValidation } from "../validation/login.validation";
import { sign } from "jsonwebtoken";
import { AppDataSource } from "../db/data-source";

/**
 * Register a new user
 *
 * @param req Request
 * @param res Response
 * @returns Promise<Response>
 */
export const Register = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { error } = RegisterValidation.validate(req.body);
		if (error) {
			res.status(400);
			return res.send(error.details);
		}

		if (req.body.password !== req.body.password_confirmation) {
			return res.json({ message: "Password does not match!" });
		}

		const repository = AppDataSource.getRepository(User);

		const newuser = new User();

		newuser.first_name = req.body.first_name;
		newuser.last_name = req.body.last_name;
		newuser.email = req.body.email;
		newuser.password = await hash(req.body.password, 10);

		const { password, ...user } = await repository.save(newuser);

		res.status(201);

		return res.json({
			message: "Account created!",
			user: user,
		});
	} catch (error) {
		return res.status(400).json({
			message: "Account creation failed, Email already exists!",
		});
	}
};

/**
 * Authenticate & login user
 *
 * @param req Request
 * @param res Response
 * @returns Promise<Response>
 */
export const Login = async (req: Request, res: Response): Promise<Response> => {
	const { error } = LoginValidation.validate(req.body);
	if (error) {
		res.status(400);
		return res.send(error.details);
	}

	const repository = AppDataSource.getRepository(User);

	const user = await repository.findOneBy({
		email: req.body.email,
	});

	if (!user) {
		return res.json({
			message: "Invalid credentials!",
		});
	}

	if (await compare(req.body.password, user.password)) {
		const token = sign({ id: user.id }, process.env.SECRET_KEY);
		res.cookie("jwt", token, {
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
			httpOnly: true,
		});
		return res.json({ message: "Login successfully!" });
	}

	res.status(400);

	return res.json({
		message: "Invalid credentials!",
	});
};

/**
 * Get the authenticated user
 *
 * @param req Request
 * @param res Response
 * @returns Promise<Response>
 */
export const AuthenticatedUser = async (
	req: Request,
	res: Response
): Promise<Response> => {
	const { password, ...user } = req["user"];
	return res.json(user);
};

/**
 * Logout the authenticated user
 *
 * @param req Request
 * @param res Response
 * @returns Promise<Response>
 */
export const Logout = async (
	req: Request,
	res: Response
): Promise<Response> => {
	// Clear the JWT token
	res.cookie("jwt", "", { maxAge: 0 });

	return res.json({ message: "success" });
};

/**
 * Update a user profile
 *
 * @param req Request
 * @param res Response
 * @returns Promise<Response>
 */
export const UpdateProfile = async (
	req: Request,
	res: Response
): Promise<Response> => {
	const user = req["user"];

	const repository = AppDataSource.getRepository(User);

	await repository.update(user.id, req.body);

	const { password, ...data } = await repository.findOneBy({ id: user.id });

	return res.json(data);
};

/**
 * Update a user password
 *
 * @param req Request
 * @param res Response
 * @returns Promise<Response>
 */
export const UpdatePassword = async (
	req: Request,
	res: Response
): Promise<Response> => {
	const user = req["user"];

	if (req.body.password !== req.body.password_confirmation) {
		return res.json({ message: "Password does not match!" });
	}

	const repository = AppDataSource.getRepository(User);

	await repository.update(user.id, {
		password: await hash(req.body.password, 10),
	});

	const { password, ...data } = await repository.findOneBy({ id: user.id });

	return res.json(data);
};
