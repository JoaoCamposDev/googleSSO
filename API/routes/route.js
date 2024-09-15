// controle de rotas na URL e funções utilizadas
const { Router }       = require ("express");

// rotas de SISTEMA
const viewTip       = require('../controllers/Functions System/read/viewTip');

// rotas de USUÁRIO
const registerUser  = require('../controllers/Functions User/create/registerUser');
const createUser    = require('../controllers/Functions User/create/createUser');

const deleteUser    = require('../controllers/Functions User/delete/deleteUser');

const forgetPwd     = require('../controllers/Functions User/forget/(Jhamim)forgetPassword.controller');
const generateToken = require('../controllers/Functions User/forget/generateToken');

const loginUser     = require('../controllers/Functions User/login/loginUser');
const checkToken    = require('../controllers/Functions User/login/(Jhamim)check.controller');

const viewProfile   = require('../controllers/Functions User/read/viewProfile');

const updateUser    = require('../controllers/Functions User/update/(Jhamim)updateUser.controller');
const updateProfile = require('../controllers/Functions User/update/updateProfile');
const updateEmail   = require('../controllers/Functions User/update/(Jhamim)confirmUpdateEmail.controller');

const googleAuthController = require('../controllers/Functions User/login/authGoogle');

const routes = Router();

routes.post  ('/user/register', registerUser.postRegister);
routes.post  ('/user',         createUser.createUser);

routes.delete('/user',         deleteUser.deleteUser);

routes.post  ('/user/pwd',        forgetPwd.password);
routes.post  ('/user/pwd/token',  checkToken.checkToken);

routes.get   ('/user');

routes.post('/register',registerUser.postRegister);
routes.post('/login',loginUser.postLogin);
routes.get('/profile',checkToken.checkToken,viewProfile.getPerfil);
routes.put('/update',checkToken.checkToken,updateProfile.updateProfile);
routes.put('/updateUser',checkToken.checkToken,updateUser.updateUser);
routes.put('/confirmUpdateEmail',checkToken.checkToken,updateEmail.updateEmail);
routes.get('/dicaDiaria', viewTip.getTip);

routes.get('/user/auth/google', googleAuthController.authGoogle);
routes.post('/user/auth/google/callback', googleAuthController.authGoogleCallback);


module.exports = routes;