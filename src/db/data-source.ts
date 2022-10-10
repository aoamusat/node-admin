import { DataSource } from "typeorm";

export const AppDataSource: DataSource = new DataSource({
	type: "mysql",
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	synchronize: true,
	logging: true,
	entities: [__dirname + "/../entity/*.ts"],
	subscribers: [],
	migrations: [],
});
