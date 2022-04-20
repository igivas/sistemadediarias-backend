import { Router } from 'express';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';

import HospedagensController from '../controllers/HospedagensController';

const hospedagensRouter = Router();
const hospedagensController = new HospedagensController();
hospedagensRouter.use(ensureAuthenticated);
hospedagensRouter.post('/', hospedagensController.create);
hospedagensRouter.get('/', hospedagensController.index);
hospedagensRouter.put('/:id', hospedagensController.update);
hospedagensRouter.put('/deletar/:id', hospedagensController.softDelete);

export default hospedagensRouter;
