const Router = require("express");
const WalletRouter = new Router();
const { body } = require("express-validator");

WalletRouter.post("/wallet"); //change Wallet
WalletRouter.delete("/wallet"); //delete Wallet
WalletRouter.get("/wallet"); //get User Wallet
WalletRouter.get("/myWallets"); //
WalletRouter.get("/myDebts"); //
WalletRouter.get("/myStats"); //
