import { Router } from 'express';
import { UsersCategoryController } from '../controller/users-category.controller.ts';
import { authMiddleware } from '@shared/middlewares/auth.middleware.ts';

const categoryUserRouter = Router();
const categoryController = new UsersCategoryController();

categoryUserRouter.use(authMiddleware);

categoryUserRouter.get('/all', categoryController.getAllByUsers.bind(categoryController));
categoryUserRouter.get('/category/:id', categoryController.getOneById.bind(categoryController));
categoryUserRouter.get('/category/:name', categoryController.getOneByName.bind(categoryController));
categoryUserRouter.post('/category', categoryController.addUserCat.bind(categoryController));
categoryUserRouter.post('/category', categoryController.addUserCat.bind(categoryController));
categoryUserRouter.put('/category', categoryController.updateUserCat.bind(categoryController));
categoryUserRouter.delete('/category/:id', categoryController.deleteUserCat.bind(categoryController));

export default categoryUserRouter;