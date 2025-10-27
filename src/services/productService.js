import ProductModel from "../models/Product.js";

export async function registerProduct(productData) {
  const { name, description, price, stockQuantity, category, imageUrl } = productData;

  const newProduct = await ProductModel.create({
    name,
    description,
    price,
    stockQuantity,
    category,
    imageUrl,
  });

  return newProduct;
};

export async function listProducts() {
  const products = await ProductModel.find({});
  return products;
};

export async function getProducts(productName) {
  const searchRegex = new RegExp(productName, "i");

  const products = await ProductModel.find({ name: { $regex: searchRegex } });
  return products;
};

export async function getId(productId) {
  const productById = await ProductModel.findById(productId);

  if (!productById) {
    throw new Error ("Produto não encontrado.")
  };
  
  return productById;
}

export async function getCategory(productCategory) {
  const searchRegex = new RegExp(productCategory, "i");

  const productsByCategory = await ProductModel.find({ category: { $regex: searchRegex } });
  return productsByCategory;
};

export async function updateExistingProduct(productId, productData) {
  const updatedProduct = await ProductModel.findByIdAndUpdate(
    productId,
    productData,
    { new: true }
  );

  if (!updatedProduct) {
    throw new Error("Produto não encontrado.");
  };

  return updatedProduct;
};

export async function deleteExistingProduct(productId) {
  const deletedProduct = await ProductModel.findByIdAndDelete(productId);

  if (!deletedProduct) {
    throw new Error("Produto não encontrado.");
  };

  console.log(`Produto ${deletedProduct.name} (ID: ${productId}) foi deletado com sucesso.`)

  return;
};
