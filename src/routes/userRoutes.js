import { Router } from "express";
import { body } from "express-validator";
import { createUser, verifyEmail, userLogin } from "../controllers/UserController.js";

// Cria uma instância do Router.
const router = Router();

const registerUserValidation = [
  // Valida o campo "name", remove espaços, não pode ser vazio.
  body("name")
    .trim()
    .notEmpty().withMessage("O nome é obrigatório."),

  // Valida o campo "email", remove espaços, minúsculas, formato de e-mail.
  body("email")
    .trim()
    .toLowerCase()
    .isEmail().withMessage("Por favor, forneça um e-mail válido."),

  // Valida o campo "password", checa a força com base nas regras.
  body("password").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  }).withMessage("A senha precisa ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número."),
];

const loginValidation = [
  // Valida o campo "email", remove espaços, minúsculas, formato de e-mail.
  body("email")
    .trim()
    .toLowerCase()
    .isEmail().withMessage("Por favor, fornaça um e-mail válido."),

  // Valida o campo "password", não pode ser vazio.
  body("password")
    .notEmpty().withMessage("A senha é obrigatória."),
];

// Rota para verificar o e-mail
router.get("/verificar-email", verifyEmail);

// Rota para cadastrar um novo usuário.
router.post("/cadastro", registerUserValidation, createUser);

// Rota para fazer login.
router.post("/login", loginValidation, userLogin);

// Exporta o roteador configurado para ser usado no app.js.
export default router;
