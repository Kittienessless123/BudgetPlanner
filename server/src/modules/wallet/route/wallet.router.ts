

import { Router } from 'express';
import { authMiddleware } from '@shared/middlewares/auth.middleware.ts'; // путь к middleware

const WalletRouter = Router();

WalletRouter.use(authMiddleware);

WalletRouter.post("/wallet"); //change Wallet
WalletRouter.delete("/wallet/id"); //delete Wallet
WalletRouter.get("/wallet"); //get Use
