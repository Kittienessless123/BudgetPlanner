const Router = require("express");
const UserRouter = new Router();
const { body } = require("express-validator");

UserRouter.post("/registration");
UserRouter.post("/login");
UserRouter.post("/logout");

UserRouter.get("/refresh");
