const Router = require("express");
const AuthRouter = new Router();

AuthRouter.post(
  "/registration"
);
AuthRouter.post("/login");
AuthRouter.post("/logout");

AuthRouter.get("/refresh",);

