import { Router } from 'express';
import ensureAuthenticated from 'middlewares/ensureAuthenticated';
import MunicipiosController from '../controllers/MunicipiosController';

const municipiosRouter = Router();
const municipiosController = new MunicipiosController();
municipiosRouter.use(ensureAuthenticated);
municipiosRouter.get('/:sigla', municipiosController.listMunicipios);

export default municipiosRouter;
