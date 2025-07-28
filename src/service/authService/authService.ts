// import jwt from "jsonwebtoken";
// import { config } from "@/config";
// import UserModel from "../../../models/UserModel";
// import { itemAvailable } from "./item-available";

// export const generateToken = (userId: string): string => {
//   return jwt.sign({ userId }, config.jwtSecret, { expiresIn: "1d" });
// };

// export const verifyToken = (token: string) => {
//   return jwt.verify(token, config.jwtSecret);
// };


// export const CheckUserAccess = async (
//   tokenString: string | null,
//   accessCode: string | null
// ) => {
//   if (!tokenString) {
//     return { success: false, message: 'Token is required', status: 401 };
//   } else {
//     // Validate the token
//     let isValidToken: any;
//     try {
//       isValidToken = verifyToken(tokenString);

//       if (!isValidToken) {
//         return { success: false, message: 'Invalid token', status: 401 };
//       }
//     } catch (error) {
//       return { success: false, message: 'Invalid token', status: 401 };
//     }

//     // check if the user in user table
//     let userID = isValidToken.userId;

//     let accessComponent = await UserModel.aggregate([
//       {
//         $match: {
//           $and: [{ ID: userID }, { isActive: true }],
//         },
//       },
//       {
//         $lookup: {
//           from: 'group_rules',
//           localField: 'userGroupId',
//           foreignField: 'groupId',
//           as: 'groupRules',
//         },
//       },
//       { $unwind: '$groupRules' },
//       {
//         $project: { accessRules: '$groupRules.ruleId' },
//       },
//       {
//         $group: {
//           _id: '',
//           accessRules: { $push: '$accessRules' },
//         },
//       },
//     ]);
//     let access = accessComponent[0] ? accessComponent[0].accessRules : [],
//       status = false;

//     if (itemAvailable(access, accessCode)) {
//       status = true;
//     }
//     return {
//       success: status,
//       access: access,
//       userId: userID,
//     };
//   }
// };
