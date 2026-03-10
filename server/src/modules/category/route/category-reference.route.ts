import { Router } from 'express';
import { CategoryReferenceController } from '../controller/category-reference.controller.ts';

const categoryReferenceRouter = Router();
const controller = new CategoryReferenceController();

categoryReferenceRouter.get('/', controller.getAllGlobal.bind(controller));
categoryReferenceRouter.get('/paginated', controller.getAllPaginated.bind(controller));
categoryReferenceRouter.get('/search', controller.searchCategories.bind(controller));
categoryReferenceRouter.get('/parent/:parentId', controller.getByParentId.bind(controller));
categoryReferenceRouter.get('/:id', controller.getGlobalById.bind(controller));

export default categoryReferenceRouter;