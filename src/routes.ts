import { Router } from "express";
import {
	AuthenticatedUser,
	Login,
	Logout,
	Register,
	UpdateProfile,
} from "./controller/auth.controller";
import { AuthMiddlware } from "./middleware/auth.middleware";

export const routes = (router: Router) => {
	router.post("/api/register", Register);
	router.post("/api/login", Login);
	router.get("/api/user", AuthMiddlware, AuthenticatedUser);
	router.post("/api/logout", AuthMiddlware, Logout);
	router.put("/api/profile/update", AuthMiddlware, UpdateProfile);
};