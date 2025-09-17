import { Request, Response, NextFunction } from "express";
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getAllProductTypes,
  getProductById,
  getProductByType,
  updateProductById,
} from "../models/productModel";

// create product
export const createProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productData = req.body;
    const createdProduct = await createProduct(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: createdProduct,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error creating product",
    });
    next(err);
  }
};

// get all products
export const getAllProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await getAllProducts();
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error fetching products",
    });
    next(err);
  }
};

// get product by id
export const getProductByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const product = await getProductById(productId);
    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error fetching product",
    });
    next(err);
  }
};

// update product by id
export const updateProductByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const productData = req.body;
    const updatedProduct = await updateProductById(productId, productData);
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error updating product",
    });
    next(err);
  }
};

// delete product by id
export const deleteProductByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    await deleteProductById(productId);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: null,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error deleting product",
    });
    next(err);
  }
};

// get product by type
export const getProductByTypeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productType = req.params.type;
    const products = await getProductByType(productType);
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error fetching products",
    });
    next(err);
  }
};

// get all product types
export const getAllProductTypesController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productTypes = getAllProductTypes();
    res.status(200).json({
      success: true,
      message: "Product types fetched successfully",
      data: productTypes,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error fetching product types",
    });
    next(err);
  }
};
