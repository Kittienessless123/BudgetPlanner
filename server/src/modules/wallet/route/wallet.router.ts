

import { Router } from 'express';
import { authMiddleware } from '@shared/middlewares/auth.middleware.ts';

const WalletRouter = Router();

WalletRouter.use(authMiddleware);

WalletRouter.post("/wallet"); 
WalletRouter.delete("/wallet/id"); 
WalletRouter.get("/wallet"); 
