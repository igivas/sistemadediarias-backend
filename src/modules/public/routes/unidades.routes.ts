import { Router } from 'express';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';

import UnidadesController from '../controllers/UnidadesController';

const unidadesRouter = Router();
const unidades = new UnidadesController();

unidadesRouter.use(ensureAuthenticated);

unidadesRouter.get('/', unidades.index);
unidadesRouter.get('/async', unidades.AsyncSelect);

export default unidadesRouter;
