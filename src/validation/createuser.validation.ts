import { Joi } from "express-validation";

export const CreateUserValidation = Joi.object({
	first_name: Joi.string().required(),
	last_name: Joi.string().required(),
	email: Joi.string().email().required(),
	role_id: Joi.number().required(),
});
