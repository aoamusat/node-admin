require("dotenv").config();
import { Repository } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { Permission } from "../entity/Permission";
import { Role } from "../entity/Role";

AppDataSource.initialize()
	.then(async (connection) => {
		const PermissionRepository: Repository<Permission> =
			AppDataSource.getRepository(Permission);

		const RoleRepository: Repository<Role> = AppDataSource.getRepository(Role);

		await PermissionRepository.delete({});

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

		let permissions_list: Array<Permission> = [];

		// Save the permissions
		permissions.forEach(async (permission) => {
			permissions_list.push(
				await PermissionRepository.save({
					name: permission,
				})
			);
		});

		await RoleRepository.save({
			name: "Admin",
			permissions: permissions_list,
		});

		delete permissions_list[3];

		await RoleRepository.save({
			name: "Editor",
			permissions: permissions_list,
		});

		delete permissions_list[1];
		delete permissions_list[5];
		delete permissions_list[7];

		await RoleRepository.save({
			name: "Viewer",
			permissions: permissions_list,
		});
	})
	.catch((error) => {
		console.log(error);
		process.exit();
	});
