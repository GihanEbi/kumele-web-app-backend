import { Router } from "express";

import {
  followUserController,
  getFollowersController,
  getFollowersFollowingCountController,
  getFollowingController,
  unfollowUserController,
} from "../controllers/followingFollowerController";
import { tokenAuthHandler } from "../middlewares/tokenAuthHandler";

const followingFollowerRouter = Router();

followingFollowerRouter.post("/follow", tokenAuthHandler, followUserController);
followingFollowerRouter.post(
  "/unfollow",
  tokenAuthHandler,
  unfollowUserController
);
followingFollowerRouter.get(
  "/get-followers",
  tokenAuthHandler,
  getFollowersController
);
followingFollowerRouter.get(
  "/get-following",
  tokenAuthHandler,
  getFollowingController
);
followingFollowerRouter.get(
  "/get-followers-following-count",
  tokenAuthHandler,
  getFollowersFollowingCountController
);

export default followingFollowerRouter;
