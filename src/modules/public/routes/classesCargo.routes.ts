import { Router } from 'express';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import ClassesCargoController from '../controllers/ClassesCargoController';

const classesCargoRouter = Router();
const classesCargoController = new ClassesCargoController();
classesCargoRouter.use(ensureAuthenticated);
classesCargoRouter.post('/', classesCargoController.create);
classesCargoRouter.get(
  '/posto/:tipific_cargo',
  classesCargoController.listCargos,
);
classesCargoRouter.get('/', classesCargoController.index);
classesCargoRouter.put('/:id', classesCargoController.update);

export default classesCargoRouter;
