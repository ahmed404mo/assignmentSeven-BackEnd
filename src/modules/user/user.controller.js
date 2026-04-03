import { Router } from "express";
import * as userService from "./user.service.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

// A- User APIs
// 1. Signup (make sure that the email does not exist before) (Don't forget to hash the password and encrypt the phone).[cite: 6]
router.post("/signup", async (req, res, next) => {
  try {
    const result = await userService.signupService(req.body);
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    next(error);
  }
});

// 2. Create an API for authenticating users (Login) and return a JSON Web Token (JWT) that contains the userId and will expire after "1 hour".[cite: 6]
router.post("/login", async (req, res, next) => {
  try {
    const result = await userService.loginService(req.body);
    if (result.token) {
      return res
        .status(result.status)
        .json({ message: result.message, token: result.token });
    }
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    next(error);
  }
});

// 3. Update logged-in user information (Except Password). (If user want to update the email, check the new email doesn't exist before.[cite: 6]
router.patch("/", auth, async (req, res, next) => {
  try {
    const result = await userService.updateUserService(
      req.user.userId,
      req.body
    );
    return res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
});

// 4. Delete logged-in user. (Get the id for the logged-in user (userId) from the token not the body)[cite: 6]
router.delete("/", auth, async (req, res, next) => {
  try {
    const result = await userService.deleteUserService(req.user.userId);
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    next(error);
  }
});

// 5. Get logged-in user data by his ID. (Get the id for the logged-in user (userId) from the token not the body)[cite: 6]
router.get("/", auth, async (req, res, next) => {
  try {
    const result = await userService.getUserDataService(req.user.userId);
    if (result.user) {
      return res.status(result.status).json(result.user);
    }
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    next(error);
  }
});

export default router;