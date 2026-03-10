import { Router } from 'express';
import { UserController } from '../controller/user.controller.ts';  
import { authMiddleware } from '@shared/middlewares/auth.middleware.ts'; 

const UserRouter = Router();

UserRouter.use(authMiddleware);

const userController = new UserController();

UserRouter.get('/user', userController.getUserDataByPk.bind(userController));          
UserRouter.post('/user', userController.updateUser.bind(userController));          
UserRouter.delete('/user', userController.deleteAccount.bind(userController));     

UserRouter.get('/myWallets', userController.getMyWallets.bind(userController));   
UserRouter.get('/myDebts', userController.getMyDebts.bind(userController));       
UserRouter.get('/myStats', userController.getMyStats.bind(userController));        

export default UserRouter;