import Joi from "joi";

export const SignupSchema = Joi.object({
    body: Joi.object({
        userName: Joi.string().required().label("UserName is required")
            .min(2).max(16),
        email: Joi.string().email().required({ tlds: { allow: false } }),
        password: Joi.string().required().label("Password is required")
            .regex(/^(?=(.*[a-zA-Z].*){2,})(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9 \S]{6,18}$/),
    })
}).options({ stripUnknown: true });


export const LoginSchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().optional(),
        userName: Joi.string().min(2).max(16,).optional(),
        password: Joi.string().min(6).required("Password is required"),
    })
})

