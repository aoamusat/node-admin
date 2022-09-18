import { Request, Response } from "express";
import { User } from "../entity/User";
import { RegisterValidation } from "../validation/register.validation";
import { hash, compare } from "bcryptjs";
import { LoginValidation } from "../validation/login.validation";
import { sign } from "jsonwebtoken";
import { AppDataSource } from "../data-source";

export const Register = async (req: Request, res: Response) => {
	const { error } = RegisterValidation.validate(req.body);
	if (error) {
		res.status(400);
		return res.send(error.details);
	}

	if (req.body.password !== req.body.password_confirmation) {
		return res.json({ message: "Password does not match!" });
	}

	const repository = AppDataSource.getRepository(User);

	const user = new User();

	user.first_name = req.body.first_name;
	user.last_name = req.body.last_name;
	user.email = req.body.email;
	user.password = await hash(req.body.password, 10);

	await repository.save(user);

	res.status(201);

	return res.json({
		message: "Account created!",
		user: user,
	});
};

export const Login = async (req: Request, res: Response) => {
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

export const AuthenticatedUser = async (req: Request, res: Response) => {
	const { password, ...user } = req["user"];
	res.json({ user: user });
};

export const Logout = async (req: Request, res: Response) => {
	res.cookie("jwt", "", { maxAge: 0 });
	res.json({ message: "success" });
};

export const UpdateProfile = async (req: Request, res: Response) => {
	const user = req["user"];

	const repository = AppDataSource.getRepository(User);

	await repository.update(user.id, req.body);

	const { password, ...data } = await repository.findOneBy({ id: user.id });

	res.json(data);
};

export const UpdatePassword = async (req: Request, res: Response) => {
	const user = req["user"];

	if (req.body.password !== req.body.password_confirmation) {
		return res.json({ message: "Password does not match!" });
	}

	const repository = AppDataSource.getRepository(User);

	await repository.update(user.id, {
		password: await hash(req.body.password, 10),
	});

	const { password, ...data } = await repository.findOneBy({ id: user.id });

	res.json(data);
};
