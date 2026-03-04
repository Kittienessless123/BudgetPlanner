const Router = require("express");
const UserRouter = new Router();
const { body } = require("express-validator");

UserRouter.post("/user"); //change User info
UserRouter.delete("/user"); //delete acc
UserRouter.get("/user");//get User info
UserRouter.get("/myWallets");//get User info wallets
UserRouter.get("/myDebts");//get User info debts
UserRouter.get("/myStats");//get User info stats
