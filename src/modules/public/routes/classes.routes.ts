import { Router } from 'express';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import ClassesController from '../controllers/ClassesController';

const classesRouter = Router();
const classesController = new ClassesController();
classesRouter.use(ensureAuthenticated);
classesRouter.post('/', classesController.create);
classesRouter.get('/', classesController.index);
classesRouter.put('/:id', classesController.update);
classesRouter.put('/deletar/:id', classesController.softDelete);

export default classesRouter;
