import { Router } from "express";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";
import {
  createProductController,
  deleteProductByIdController,
  getAllProductsController,
  getAllProductTypesController,
  getProductByIdController,
  getProductByTypeController,
  updateProductByIdController,
} from "../controllers/productController";
const productRoute = Router();

productRoute.post("/create-product", tokenAuthHandler, createProductController);
productRoute.get(
  "/get-all-products",
  tokenAuthHandler,
  getAllProductsController
);
productRoute.get(
  "/get-product/:id",
  tokenAuthHandler,
  getProductByIdController
);
productRoute.put(
  "/update-product/:id",
  tokenAuthHandler,
  updateProductByIdController
);
productRoute.delete(
  "/delete-product/:id",
  tokenAuthHandler,
  deleteProductByIdController
);
productRoute.get(
  "/get-products-by-type/:type",
  tokenAuthHandler,
  getProductByTypeController
);
productRoute.get(
  "/get-product-types",
  tokenAuthHandler,
  getAllProductTypesController
);
export default productRoute;
