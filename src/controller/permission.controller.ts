import { Response, Request } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { Permission } from "../entity/Permission";

export const Permissions = async (req: Request, res: Response) => {
	const PermissionRepository: Repository<Permission> =
		AppDataSource.getRepository(Permission);
	return res.json(await PermissionRepository.find());
};
