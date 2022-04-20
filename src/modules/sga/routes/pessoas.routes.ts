import { Router } from 'express';
import PoliciaisECivisController from '../controllers/PoliciaisECivisController';

import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';

const pessoasRouter = Router();
const pessoas = new PoliciaisECivisController();

pessoasRouter.use(ensureAuthenticated);

pessoasRouter.get('/', pessoas.index);

export default pessoasRouter;
