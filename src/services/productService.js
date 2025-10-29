import ProductModel from "../models/Product.js";
import ApiError from "../utils/ApiError.js";

// Função para cadastrar novo produto.
export async function registerProduct(productData) {
  // Pega os dados validados que o controller enviou.
  const { name, description, price, stockQuantity, category, imageUrl } = productData;

  // Cria o produto no banco de dados.
  const newProduct = await ProductModel.create({
    name,
    description,
    price,
    stockQuantity,
    category,
    imageUrl,
  });

  // Retorna o objeto do produto criado para o controller.
  return newProduct;
};

// Função para listar todos os produtos
export async function listProducts() {
  const products = await ProductModel.find({}); // Busca os produtos no banco de dados.
  return products; // Retorna o array de produtos (pode ser vazio se nada for encontrado).
};

// Função para buscar produtos pelo nome (case-insensitive).
export async function getProducts(productName) {
  // Cria o Regex para busca parcial e case-insensitive.
  const searchRegex = new RegExp(productName, "i");

  // Busca produtos onde o "name" corresponda ao Regex.
  const products = await ProductModel.find({ name: { $regex: searchRegex } });

  // Retorna o array encontrado (pode ser vazio).
  return products;
};

// Serviço para buscar um produto pelo ID.
export async function getId(productId) {
  // Busca um único produto pelo seu _id.
  const productById = await ProductModel.findById(productId);

  // Lança erro caso o produto não exista.
  if (!productById) {
    throw new ApiError(404, "Produto não encontrado.")
  };

  // Retorna o objeto do produto encontrado.
  return productById;
}

// Função para buscar produtos pela categoria (case-insensitive).
export async function getCategory(productCategory) {
  // Cria o Regex para busca case-insensitive na categoria.
  const searchRegex = new RegExp(productCategory, "i");

  // Busca produtos onde 'category' corresponda ao Regex.
  const productsByCategory = await ProductModel.find({ category: { $regex: searchRegex } });

  // Retorna o array encontrado (pode ser vazio).
  return productsByCategory;
};

// Função para atualizar um produto existente.
export async function updateExistingProduct(productId, productData) {
  // Encontra pelo ID e atualiza com os novos dados.
  const updatedProduct = await ProductModel.findByIdAndUpdate(
    productId,
    productData, // Objeto com os campos a serem atualizados.
    { new: true } // Retorna a versão atualizada do documento.
  );

  // Lança erro caso o produto não exista.
  if (!updatedProduct) {
    throw new ApiError(404, "Produto não encontrado.");
  };

  // Retorna o produto com os dados atualizados.
  return updatedProduct;
};

// Função para deletar um produto existente.
export async function deleteExistingProduct(productId) {
  // Encontra pelo ID e deleta.
  const deletedProduct = await ProductModel.findByIdAndDelete(productId);

  // Lança erro caso o produto não exista.
  if (!deletedProduct) {
    throw new ApiError(404, "Produto não encontrado.");
  };

  // Log interno para controle.
  console.log(`Produto ${deletedProduct.name} (ID: ${productId}) foi deletado com sucesso.`)

  // Função termina sem retornar valor.
  return;
};
