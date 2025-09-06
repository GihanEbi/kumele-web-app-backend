import e, { Request, Response, NextFunction } from "express";
import {
  createAdvertCallToActionService,
  createAdvertDailyBudgetService,
  createAdvertLanguageService,
  createAdvertRegionService,
  createAdvertService,
  getAdvertByIdService,
  getAdvertCallToActionByIdService,
  getAdvertDailyBudgetByIdService,
  getAdvertLanguageByIdService,
  getAdvertRegionByIdService,
  getAdvertsByCategoryIdService,
  getAdvertsByUserIdService,
  getAllAdvertCallToActionsService,
  getAllAdvertDailyBudgetsService,
  getAllAdvertLanguagesService,
  getAllAdvertRegionsService,
  getAllAdvertsService,
  getSavedAdvertsByUserIdService,
  updateAdvertByIdService,
  updateAdvertCallToActionByIdService,
  updateAdvertDailyBudgetByIdService,
  updateAdvertLanguageByIdService,
  updateAdvertRegionByIdService,
} from "../models/advertModel";
import fs from "fs";

// this function is for create the advert image and return its path
export const createAdvertImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check if a file was actually uploaded by Multer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }
    const normalizedPath = req.file.path.replace(/\\/g, "/");

    res.status(201).json({
      message: "advert image created successfully.",
      advert_img_url: normalizedPath,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error creating advert image",
    });
    next(err);
  }
};

export const createAdvert = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const advertData = req.body;
  const user_id = req.UserID;

  try {
    const newAdvert = await createAdvertService({ user_id, advertData });
    res
      .status(201)
      .json({ message: "Advert created successfully.", advert: newAdvert });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Login failed",
    });
    next(err);
  }
};

// get saved advert id list by user id
export const getSavedAdvertsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.UserID;
    const savedAdverts = await getSavedAdvertsByUserIdService(userId);
    res.status(200).json({
      success: true,
      data: savedAdverts,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving saved adverts",
    });
    next(err);
  }
};

// get all advert
export const getAllAdverts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adverts = await getAllAdvertsService();

    res.status(200).json({
      success: true,
      data: adverts,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving adverts",
    });
    next(err);
  }
};
// this function retrieves adverts by user ID
export const getAdvertsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const adverts = await getAdvertsByUserIdService(userId);
    res.status(200).json({
      success: true,
      data: adverts,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving adverts",
    });
    next(err);
  }
};
// this function retrieves adverts by category ID
export const getAdvertsByCategoryId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = req.params.categoryId;
    const adverts = await getAdvertsByCategoryIdService(categoryId);
    res.status(200).json({
      success: true,
      data: adverts,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving adverts",
    });
    next(err);
  }
};
// this function retrieves an advert by its ID
export const getAdvertById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const advertId = req.params.advertId;
    const advert = await getAdvertByIdService(advertId);
    res.status(200).json({
      success: true,
      data: advert,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving advert",
    });
    next(err);
  }
};

// this function updates an advert by its ID
export const updateAdvertById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const advertId = req.params.advertId;
    const updatedData = req.body;
    const updatedAdvert = await updateAdvertByIdService(advertId, updatedData);
    res.status(200).json({
      success: true,
      data: updatedAdvert,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error updating advert",
    });
    next(err);
  }
};

// ================ advert other function for admin ==================
// create a function to create advert region
export const createAdvertRegion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const regionData = req.body;

  try {
    const newRegion = await createAdvertRegionService(regionData);
    res.status(201).json({
      success: true,
      message: "Advert region created successfully.",
      data: newRegion,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error creating advert region",
    });
    next(err);
  }
};

// get all advert regions
export const getAllAdvertRegions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const regions = await getAllAdvertRegionsService();
    res.status(200).json({
      success: true,
      data: regions,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving advert regions",
    });
    next(err);
  }
};

// get advert region by id
export const getAdvertRegionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const regionId = req.params.regionId;
    const region = await getAdvertRegionByIdService(regionId);
    res.status(200).json({
      success: true,
      data: region,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving advert region",
    });
    next(err);
  }
};

// update advert region by id
export const updateAdvertRegionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const regionId = req.params.regionId;
  const updatedData = req.body;

  try {
    const updatedRegion = await updateAdvertRegionByIdService(
      regionId,
      updatedData
    );
    res.status(200).json({
      success: true,
      data: updatedRegion,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error updating advert region",
    });
    next(err);
  }
};

// ============ advert language functions ==================
// create advert language
export const createAdvertLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const languageData = req.body;
  try {
    const newLanguage = await createAdvertLanguageService(languageData);
    res.status(201).json({
      success: true,
      message: "Advert language created successfully.",
      data: newLanguage,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error creating advert language",
    });
    next(err);
  }
};

// get all advert languages
export const getAllAdvertLanguages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const languages = await getAllAdvertLanguagesService();
    res.status(200).json({
      success: true,
      data: languages,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving advert languages",
    });
    next(err);
  }
};

// get advert language by id
export const getAdvertLanguageById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const languageId = req.params.languageId;
    const language = await getAdvertLanguageByIdService(languageId);
    res.status(200).json({
      success: true,
      data: language,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving advert language",
    });
    next(err);
  }
};

// update advert language by id
export const updateAdvertLanguageById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const languageId = req.params.languageId;
  const updatedData = req.body;

  try {
    const updatedLanguage = await updateAdvertLanguageByIdService(
      languageId,
      updatedData
    );
    res.status(200).json({
      success: true,
      data: updatedLanguage,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error updating advert language",
    });
    next(err);
  }
};

// ============= advert daily budget functions ==================
// create advert daily budget
export const createAdvertDailyBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const budgetData = req.body;
  try {
    const newBudget = await createAdvertDailyBudgetService(budgetData);
    res.status(201).json({
      success: true,
      message: "Advert daily budget created successfully.",
      data: newBudget,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error creating advert daily budget",
    });
    next(err);
  }
};

// get all advert daily budgets
export const getAllAdvertDailyBudgets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const budgets = await getAllAdvertDailyBudgetsService();
    res.status(200).json({
      success: true,
      data: budgets,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving advert daily budgets",
    });
    next(err);
  }
};

// get advert daily budget by id
export const getAdvertDailyBudgetById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const budgetId = req.params.budgetId;
  try {
    const budget = await getAdvertDailyBudgetByIdService(budgetId);
    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving advert daily budget",
    });
    next(err);
  }
};

// update advert daily budget by id
export const updateAdvertDailyBudgetById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const budgetId = req.params.budgetId;
  const updatedData = req.body;

  try {
    const updatedBudget = await updateAdvertDailyBudgetByIdService(
      budgetId,
      updatedData
    );
    res.status(200).json({
      success: true,
      data: updatedBudget,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error updating advert daily budget",
    });
    next(err);
  }
};

// ====== call to action functions ======
// create advert call to action
export const createAdvertCallToAction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const callToActionData = req.body;
  try {
    const newCallToAction = await createAdvertCallToActionService(
      callToActionData
    );
    res.status(201).json({
      success: true,
      message: "Advert call to action created successfully.",
      data: newCallToAction,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error creating advert call to action",
    });
    next(err);
  }
};

// get all advert call to actions
export const getAllAdvertCallToActions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const callToActions = await getAllAdvertCallToActionsService();
    res.status(200).json({
      success: true,
      data: callToActions,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving advert call to actions",
    });
    next(err);
  }
};

// get advert call to action by id
export const getAdvertCallToActionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ctaId = req.params.id;
  try {
    const callToAction = await getAdvertCallToActionByIdService(ctaId);
    res.status(200).json({
      success: true,
      data: callToAction,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error retrieving advert call to action",
    });
    next(err);
  }
};

// update advert call to action by id
export const updateAdvertCallToActionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ctaId = req.params.id;
  const updatedData = req.body;

  try {
    const updatedCallToAction = await updateAdvertCallToActionByIdService(
      ctaId,
      updatedData
    );
    res.status(200).json({
      success: true,
      data: updatedCallToAction,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Error updating advert call to action",
    });
    next(err);
  }
};
