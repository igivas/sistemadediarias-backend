import { Router } from 'express';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
// import ensureAuthorizated from '../../../middlewares/ensureAuthorizated';
import uploadImage from '../../../middlewares/uploadImage';
import PoliciaisController from '../controllers/PoliciaisController';
import PoliciaisEmailsController from '../controllers/PoliciaisEmailsController';
import PoliciaisTelefonesController from '../controllers/PoliciaisTelefonesController';
import PoliciaisEnderecosController from '../controllers/PoliciaisEnderecosController';
import PoliciaisUniformesController from '../controllers/PoliciaisUniformesController';
import ImagesController from '../controllers/ImagesController';

const policiaisRouter = Router();
const policiais = new PoliciaisController();
const policiaisEmails = new PoliciaisEmailsController();
const policiaisTelefones = new PoliciaisTelefonesController();
const policiaisEnderecos = new PoliciaisEnderecosController();
const imagesController = new ImagesController();
const policiaisUniformes = new PoliciaisUniformesController();

policiaisRouter.use(ensureAuthenticated);
policiaisRouter.get('/', policiais.index);
policiaisRouter.get('/graduacoes', policiais.indexGraduacoes);
policiaisRouter.post('/emails', policiaisEmails.create);
policiaisRouter.delete('/emails/:id', policiaisEmails.delete);
policiaisRouter.post('/telefones', policiaisTelefones.create);
policiaisRouter.delete('/telefones/:id', policiaisTelefones.delete);
policiaisRouter.put('/telefones/:id', policiaisTelefones.update);
policiaisRouter.put('/enderecos/:id', policiaisEnderecos.update);
policiaisRouter.post('/enderecos', policiaisEnderecos.create);
policiaisRouter.get('/enderecos/:id', policiaisEnderecos.show);
policiaisRouter.get('/uniformes/:pes_codigo', policiaisUniformes.show);
policiaisRouter.get('/uniformes/cod/:id', policiaisUniformes.showbyId);
policiaisRouter.get('/uniformes/opm/:opm', policiaisUniformes.index);
policiaisRouter.get(
  '/uniformes/dashboardopm/:opm',
  policiaisUniformes.indexDashboardOpm,
);

policiaisRouter.get(
  '/uniformes/dashboardcolog/listar',
  policiaisUniformes.indexDashboardColog,
);

policiaisRouter.get(
  '/uniformes/relatorioquantitativo/:opm',
  policiaisUniformes.indexRelatorioQuantidades,
);

policiaisRouter.get(
  '/uniformes/opm/pendentes/:opm',
  policiaisUniformes.indexPendentes,
);
policiaisRouter.put('/uniformes/:id', policiaisUniformes.update);
policiaisRouter.get('/:id/images', imagesController.show);
policiaisRouter.put('/:id/images', uploadImage, imagesController.update);

export default policiaisRouter;
