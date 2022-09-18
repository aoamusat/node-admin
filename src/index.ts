require("dotenv").config();

import express = require("express");
import cors = require("cors");
import { routes } from "./routes";
import "reflect-metadata";
import cookieParser = require("cookie-parser");
import { AppDataSource } from "./data-source";

// Create Database connection
AppDataSource.initialize()
	.then((connection) => {
		const app = express();

		app.use(express.json());
		app.use(cookieParser());
		app.use(
			cors({
				credentials: true,
				origin: ["http://localhost:3045"],
			})
		);

		routes(app);

		app.get("/", (req: express.Request, res: express.Response) => {
			res.json({ message: "Hello World" });
		});

		app.listen(process.env.PORT || 3041, () => {
			console.log("Server listening on port " + process.env.PORT);
		});
	})
	.catch((error) => {
		console.log(error);
	});
