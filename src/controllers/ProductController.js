import { validationResult } from "express-validator";
import * as productService from "../services/productService.js";

export async function createProduct(req, res, next) {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    };

    const registerResult = await productService.registerProduct(req.body);
    return res.status(201).json(registerResult);
  } catch (error) {
    next(error);
  };
};

export async function listAllProducts(req, res, next) {
  try {
    const products = await productService.listProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  };
};

export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productService.getId(id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  };
};

export async function getProductsByName(req, res, next) {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Por favor, digite um produto para a busca." });
    };

    const products = await productService.getProducts(name);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  };
};

export async function getProductsByCategory(req, res, next) {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Por favor, digite uma gategoria para a busca." });
    };

    const products = await productService.getCategory(category);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  };
};

export async function updateProduct(req, res, next) {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    };

    const updateResult = await productService.updateExistingProduct(req.params.id, req.body);
    return res.status(201).json(updateResult);
  } catch (error) {
    next(error)
  };
};

export async function deleteProduct(req, res, next) {
  try {
    const deletedProduct = await productService.deleteExistingProduct(req.params.id);
    return res.status(204).send()
  } catch (error) {
    next(error)
  };
}
