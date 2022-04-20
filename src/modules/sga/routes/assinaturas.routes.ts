import { Router } from 'express';
import ensureAuthorizated from '../../../middlewares/ensureAuthorizated';
import AssinaturasController from '../controllers/AssinaturasController';
import LinksController from '../controllers/LinksController';
import PinsController from '../controllers/PinsController';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';

const assinaturasRouter = Router();

const assinaturas = new AssinaturasController();
const links = new LinksController();
const pins = new PinsController();

assinaturasRouter.post('/', assinaturas.create);
assinaturasRouter.post('/check', assinaturas.check);
assinaturasRouter.get('/links/check', links.show);

assinaturasRouter.post('/pins', ensureAuthenticated, pins.create);
assinaturasRouter.put(
  '/revoga/completo',
  ensureAuthenticated,
  ensureAuthorizated(['SGA - ADM']),
  assinaturas.updateRevogaAssinaturaValidacao,
);
assinaturasRouter.post('/links', ensureAuthenticated, links.create);
assinaturasRouter.post('/autentica', assinaturas.checkNoPin);

export default assinaturasRouter;
