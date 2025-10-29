import { validationResult } from "express-validator";
import * as productService from "../services/productService.js";

export async function createProduct(req, res, next) {
  try {
    // Verifica se houve erros de validação.
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // Retorna 400 Bad Request se a validação falhar.
      return res.status(400).json({ errors: errors.array() });
    };

    // Delega a criação para o productService, passando os dados do body.
    const registerResult = await productService.registerProduct(req.body);
    // Retorna 201 Created com o produto recém-criado.
    return res.status(201).json(registerResult);
  } catch (error) {
    // Passa qualquer erro para o errorHandler.
    next(error);
  };
};

export async function listAllProducts(req, res, next) {
  try {
    // Chama a função para buscar todos os produtos.
    const products = await productService.listProducts();

    // Retorna 200 OK com a lista de produtos (pode ser vazia).
    return res.status(200).json(products);
  } catch (error) {
    // Passa qualquer erro para o errorHandler.
    next(error);
  };
};

export async function getProductById(req, res, next) {
  try {
    // Pega o ID do produto dos parâmetros da rota
    const { id } = req.params;

    // Chama a função para buscar o produto específico.
    const product = await productService.getId(id);

    // Retorna 200 OK com os dados do produto.
    return res.status(200).json(product);
  } catch (error) {
    // Passa qualquer erro para o errorHandler.
    next(error);
  };
};

export async function getProductsByName(req, res, next) {
  try {
    // Pega o termo de busca da query string
    const { name } = req.query;

    // Validando se o termo foi fornecido
    if (!name) {
      return res.status(400).json({ message: "Por favor, digite um produto para a busca." });
    };

    // Chama a função para realizar a busca por nome.
    const products = await productService.getProducts(name);

    // Retorna 200 OK com a lista de produtos encontrados.
    return res.status(200).json(products);
  } catch (error) {
    // Passa qualquer erro para o errorHandler.
    next(error);
  };
};

export async function getProductsByCategory(req, res, next) {
  try {
    // Pega o termo de busca da query string
    const { category } = req.query;

    // Validando se a categoria foi fornecida.
    if (!category) {
      return res.status(400).json({ message: "Por favor, digite uma categoria para a busca." });
    };

    // Chama a função para realizar a busca por categoria.
    const products = await productService.getCategory(category);

    // Retorna 200 OK com a lista de produtos encontrados
    return res.status(200).json(products);
  } catch (error) {
    // Passa qualquer erro para o errorHandler.
    next(error);
  };
};

export async function updateProduct(req, res, next) {
  try {
    // Verifica erros de validação
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    };

    // Chama a função para realizar a atualização.
    const updateResult = await productService.updateExistingProduct(req.params.id, req.body);

    // Retorna 200 OK com o produto atualizado.
    return res.status(200).json(updateResult);
  } catch (error) {
    // Passa qualquer erro para o errorHandler.
    next(error)
  };
};

export async function deleteProduct(req, res, next) {
  try {
    // Chama a função de deletar
    await productService.deleteExistingProduct(req.params.id);

    // Retorna 204 No Content para indicar sucesso na deleção.
    return res.status(204).send()
  } catch (error) {
    // Passa qualquer erro para o errorHandler.
    next(error)
  };
}
