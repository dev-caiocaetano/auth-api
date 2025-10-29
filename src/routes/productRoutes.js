import { Router } from "express";
import { body } from "express-validator";
import { createProduct, deleteProduct, getProductById, getProductsByCategory, getProductsByName, listAllProducts, updateProduct } from "../controllers/ProductController.js";
import { authenticatedAdmin, authenticatedUser } from "../middlewares/authMiddlewares.js";

// Cria uma instância do roteador do Express
const router = Router();

const registerProductValidation = [
  // Valida o campo "name", remove espaços, não pode ser vazio.
  body("name")
    .trim()
    .notEmpty().withMessage("O nome do produto é obrigatório."),

  // Campo de descrição opcional, mas se existir, remove espaços no começo/fim e deve ter no máximo 500 caracteres
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Adicione uma descrição de até 500 caracteres ao produto."),

   //Valida o preço, deve ser um número maior que zero (float)
  body("price")
    .isFloat({ gt: 0 }).withMessage("O preço deve ser um número maior que zero."),

    //Valida o estoque e deve ser um número inteiro maior que zero
  body("stockQuantity")
    .isInt({ gte: 0 }).withMessage("A quantidade em estoque deve ser um número inteiro igual ou maior que zero."),

    //Valida a categoria e deve estar dentro das opções pré-definidas no Model.
  body("category")
    .isIn(["Pedras", "Incensos", "Decoração"]).withMessage("Categoria inválida."),

    //Opcional, mas se informado, precisa ser um link válido.
  body("imageUrl")
    .optional()
    .isURL().withMessage("Forneça um link de imagem válido."),
];

// Segue a mesma lógica acima, mas tudo opcional.
const updateProductValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty().withMessage("O nome do produto é obrigatório."),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Adicione uma descrição de até 500 caracteres ao produto."),

  body("price")
    .optional()
    .isFloat({ gt: 0 }).withMessage("O preço deve ser um número maior que zero."),

  body("stockQuantity")
    .optional()
    .isInt({ gte: 0 }).withMessage("A quantidade em estoque deve ser um número inteiro igual ou maior que zero."),

  body("category")
    .optional()
    .isIn(["Pedras", "Incensos", "Decoração"]).withMessage("Categoria inválida."),

  body("imageUrl")
    .optional()
    .isURL().withMessage("Forneça um link de imagem válido."),
];

router.get("/", listAllProducts);
router.get("/:id", getProductById);
router.get("/buscar-produto", getProductsByName);
router.get("/buscar-categoria", getProductsByCategory);

router.post("/", authenticatedUser, authenticatedAdmin, registerProductValidation, createProduct);
router.delete("/:id", authenticatedUser, authenticatedAdmin, deleteProduct);
router.put("/:id", authenticatedUser, authenticatedAdmin, updateProductValidation, updateProduct);

export default router;
