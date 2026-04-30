import { Router } from "express";
import { AuthController } from "../controller/auth.controller.js";

export const createAuthRouter = (authController: AuthController) => {
  const router = Router();
  
  router.post("/registration", authController.registration.bind(authController));
  router.post("/login", authController.login.bind(authController));
  router.post("/logout", authController.logout.bind(authController));
  router.get("/refresh", authController.refresh.bind(authController));
  
  return router;
};