const Router = require("express");
const AuthRouter = new Router();
const { body } = require("express-validator");

AuthRouter.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 4, max: 32 }),
);
AuthRouter.post("/login");
AuthRouter.post("/logout");

AuthRouter.get("/refresh",);

