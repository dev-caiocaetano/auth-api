import { Router } from "express";
import { body } from "express-validator";
import { createUser, verifyEmail, userLogin } from "../controllers/UserController.js";

const router = Router();

const registerUserValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("O nome é obrigatório."),

  body("email")
    .trim()
    .toLowerCase()
    .isEmail().withMessage("Por favor, forneça um e-mail válido."),

  body("password").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  }).withMessage("A senha precisa ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número."),
];

const loginValidation = [
  body("email")
    .trim()
    .toLowerCase()
    .isEmail().withMessage("Por favor, fornaça um e-mail válido."),

  body("password")
    .notEmpty().withMessage("A senha é obrigatória."),
];

router.get("/verificar-email", verifyEmail);
router.post("/cadastro", registerUserValidation, createUser);
router.post("/login", loginValidation, userLogin);


export default router;
