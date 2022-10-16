import { Response, Request } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { Role } from "../entity/Role";

export const Roles = async (req: Request, res: Response) => {
	const RoleRepository: Repository<Role> = AppDataSource.getRepository(Role);
	return res.json(await RoleRepository.find());
};

export const CreateRole = async (req: Request, res: Response) => {
	const { name, permissions }: { name: string; permissions: Array<Number> } =
		req.body;

	const RoleRepository: Repository<Role> = AppDataSource.getRepository(Role);

	const role = await RoleRepository.save({
		name,
		permissions: permissions.map((id) => {
			return { id: id };
		}),
	});

	res.json(role);
};

export const GetRole = async (req: Request, res: Response) => {
	const { id } = req.params;

	const RoleRepository: Repository<Role> = AppDataSource.getRepository(Role);

	const role = await RoleRepository.findOne({
		where: { id: Number(id) },
		relations: { permissions: true },
	});

	if (role) {
		return res.json(role);
	}

	res.status(404).json({ message: "Not found!" });
};
