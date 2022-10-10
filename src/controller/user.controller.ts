import { AppDataSource } from "../db/data-source";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { CreateUserValidation } from "../validation/createuser.validation";
import { hash } from "bcryptjs";
import { Repository } from "typeorm";

/**
 * Fetch all users
 *
 * @param req Request
 * @param res Response
 * @returns Promise<Response>
 */
export const Users = async (req: Request, res: Response): Promise<Response> => {
	const userRepository = AppDataSource.getRepository(User);

	let AllUsers: any = await userRepository.find({ relations: ["role"] });

	AllUsers = AllUsers.map((user: { [x: string]: any; password: any }) => {
		const { password, ...u } = user;
		return u;
	});

	return res.json(AllUsers);
};

/**
 * Create a new user
 *
 * @param req Request
 * @param res Response
 * @returns Promise<Response>
 */
export const CreateUser = async (
	req: Request,
	res: Response
): Promise<Response> => {
	const { error } = CreateUserValidation.validate(req.body);

	if (error) {
		res.status(400);
		return res.send(error.details);
	}

	const { role_id } = req.body;

	const userRepository = AppDataSource.getRepository(User);

	const EmailExists = await userRepository.findOneBy({ email: req.body.email });

	if (EmailExists) {
		return res.status(400).json({ message: "Email already exists" });
	}

	const user = new User();

	user.email = req.body.email;
	user.first_name = req.body.first_name;
	user.last_name = req.body.last_name;
	user.password = await hash("1234567890", 10);
	user.role = role_id;

	userRepository.save(user);

	return res.status(201).json({
		message: "Successfully created",
		user: {
			email: user.email,
			first_name: user.first_name,
			last_name: user.last_name,
		},
	});
};

/**
 *
 * @param req Request
 * @param res Response
 * @returns Promise<Response>
 */
export const GetUser = async (
	req: Request,
	res: Response
): Promise<Response> => {
	const id = req.params.id;

	const UserRepository = AppDataSource.getRepository(User);

	const user = await UserRepository.findOne({
		where: { id: id },
		relations: {
			role: true,
		},
	});

	if (user) {
		const { password, ...u } = user;
		return res.status(200).json(u);
	}
	return res.status(404).json({ message: "User not found!" });
};

/**
 * Update a user profile
 *
 * @param req Request
 * @param res Response
 *
 * @returns JSON
 */
export const UpdateUser = async (
	req: Request,
	res: Response
): Promise<Response> => {
	const { id } = req.params;

	const { role_id, ...body } = req.body;

	const UserRepository: Repository<User> = AppDataSource.getRepository(User);

	await UserRepository.update(id, { ...body, role: { id: role_id } });

	const user: User = await UserRepository.findOneBy({ id: id });

	if (user) {
		const { password, ...data } = user;
		return res.status(202).json(data);
	}

	return res.status(404).json({ message: "User not found" });
};

/**
 * Delete a user from the DB
 *
 * @param req Request
 * @param res Response
 */
export const DeleteUser = async (
	req: Request,
	res: Response
): Promise<Response> => {
	const { id } = req.params;

	const UserRepository: Repository<User> = AppDataSource.getRepository(User);

	const user: User = await UserRepository.findOneBy({ id });

	if (user) {
		await UserRepository.delete({ id });
		return res.status(204).json({ message: "User deleted successfully!" });
	}

	return res.status(404).json({ message: "User not found!" });
};
