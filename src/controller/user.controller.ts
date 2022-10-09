import { AppDataSource } from "../db/data-source";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { CreateUserValidation } from "../validation/createuser.validation";
import { hash } from "bcryptjs";

/**
 * Fetch all users
 *
 * @param req Request
 * @param res Response
 * @returns Promise<Response>
 */
export const Users = async (req: Request, res: Response): Promise<Response> => {
	const userRepository = AppDataSource.getRepository(User);

	let allUsers: any = await userRepository.find();

	allUsers = allUsers.map((user: { [x: string]: any; password: any }) => {
		const { password, ...u } = user;
		return u;
	});

	return res.json(allUsers);
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
	const id = Number(req.params.id);

	const UserRepository = AppDataSource.getRepository(User);

	const user = await UserRepository.findOneBy({ id: id.toString() });

	const { password, ...u } = user;

	return res.status(200).json(u);
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

	const UserRepository = AppDataSource.getRepository(User);

	const user = await UserRepository.update(id, req.body);

	return res.json(user);
};
