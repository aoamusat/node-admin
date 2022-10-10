import { Router } from "express";
import {
	AuthenticatedUser,
	Login,
	Logout,
	Register,
	UpdatePassword,
	UpdateProfile,
} from "./controller/auth.controller";
import {
	CreateUser,
	GetUser,
	UpdateUser,
	Users,
} from "./controller/user.controller";
import { AuthMiddlware } from "./middleware/auth.middleware";

export const routes = (router: Router) => {
	router.post("/api/register", Register);
	router.post("/api/login", Login);
	router.get("/api/user", AuthMiddlware, AuthenticatedUser);
	router.post("/api/logout", AuthMiddlware, Logout);
	router.put("/api/profile/update", AuthMiddlware, UpdateProfile);
	router.put("/api/password/update", AuthMiddlware, UpdatePassword);
	router.get("/api/users", AuthMiddlware, Users);
	router.post("/api/users", AuthMiddlware, CreateUser);
	router.put("/api/users/:id", AuthMiddlware, UpdateUser);
	router.get("/api/users/:id", AuthMiddlware, GetUser);
};
