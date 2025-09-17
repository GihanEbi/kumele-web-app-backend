import { pool } from "../config/db";
import { id_codes } from "../constants/idCodeConstants";
import { productConstants } from "../constants/productConstants";
import { createProductSchema } from "../lib/schemas/schemas";
import { createId } from "../service/idGenerator/idGenerator";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { Product } from "../types/types";

// create product
export const createProduct = async (productData: Product) => {
  // check all input data with schema validation in Joi
  let checkData = validation(createProductSchema, productData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }
  const { name, description, type, price } = productData;
  try {
    const productId = await createId(id_codes.idCode.product);

    const result = await pool.query(
      `INSERT INTO products (id, name, description, type, price)
            VALUES ($1, $2, $3, $4, $5)
        `,
      [productId, name, description, type, price]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Error creating product");
  }
};

// get all products
export const getAllProducts = async () => {
  try {
    const query = `SELECT * FROM products`;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
};

// get product by id
export const getProductById = async (productId: string) => {
  try {
    const query = `SELECT * FROM products WHERE id = $1`;
    const result = await pool.query(query, [productId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Error fetching product");
  }
};

// update product by id
export const updateProductById = async (
  productId: string,
  productData: Product
) => {
  // check all input data with schema validation in Joi
  let checkData = validation(createProductSchema, productData);
  if (checkData !== null) {
    let errorMessage = Object.values(checkData).join(", ");
    const error = new Error(errorMessage);
    (error as any).statusCode = 400;
    throw error;
  }
  // check if product exists
  const existingProduct = await getProductById(productId);
  if (!existingProduct) {
    const error = new Error("Product not found");
    (error as any).statusCode = 404;
    throw error;
  }
  const { name, description, type, price } = productData;
  try {
    const query = `
            UPDATE products
            SET name = $1, description = $2, type = $3, price = $4
            WHERE id = $5
        `;
    const values = [name, description, type, price, productId];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Error updating product");
  }
};

// delete product by id
export const deleteProductById = async (productId: string) => {
  // check if product exists
  const existingProduct = await getProductById(productId);
  if (!existingProduct) {
    const error = new Error("Product not found");
    (error as any).statusCode = 404;
    throw error;
  }
  try {
    const query = `
            DELETE FROM products
            WHERE id = $1
        `;
    const values = [productId];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Error deleting product");
  }
};

// get the product by type
export const getProductByType = async (type: string) => {
  // check if type is valid
  const validTypes = Object.values(productConstants.productTypes);
  if (!validTypes.includes(type)) {
    const error = new Error("Invalid product type");
    (error as any).statusCode = 400;
    throw error;
  }
  try {
    const query = `SELECT * FROM products WHERE type = $1`;
    const result = await pool.query(query, [type]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching product by type:", error);
    throw new Error("Error fetching product by type");
  }
};

// get all product types
export const getAllProductTypes = () => {
  return Object.values(productConstants.productTypes);
}
