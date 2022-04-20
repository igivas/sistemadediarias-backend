import { Router } from 'express';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import FinalidadesController from '../controllers/FinalidadesController';

const finalidadesRouter = Router();
const finalidadesController = new FinalidadesController();
finalidadesRouter.use(ensureAuthenticated);
finalidadesRouter.post('/', finalidadesController.create);
finalidadesRouter.get('/', finalidadesController.index);
finalidadesRouter.put('/:id', finalidadesController.update);
finalidadesRouter.put('/deletar/:id', finalidadesController.softDelete);

export default finalidadesRouter;
