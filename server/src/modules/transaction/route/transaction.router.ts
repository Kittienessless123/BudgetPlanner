const Router = require("express");
const WalletRouter = new Router();
const { body } = require("express-validator");

WalletRouter.post("/wallet");
WalletRouter.delete("/wallet"); 
WalletRouter.get("/wallet"); 
WalletRouter.get("/myWallets");
WalletRouter.get("/myDebts"); 
WalletRouter.get("/myStats"); 
