require("dotenv").config();
import { Repository } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { Permission } from "../entity/Permission";

AppDataSource.initialize()
	.then(async (connection) => {
		const PermissionRepository: Repository<Permission> =
			AppDataSource.getRepository(Permission);

		const permissions: Array<string> = [
			"view_users",
			"edit_users",
			"view_roles",
			"edit_roles",
			"view_products",
			"edit_products",
			"view_orders",
			"edit_orders",
		];
		permissions.forEach(async (permission) => {
			await PermissionRepository.save({
				name: permission,
			});
		});
	})
	.catch((error) => {
		console.log(error);
	});
