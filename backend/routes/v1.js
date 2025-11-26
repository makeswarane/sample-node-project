const express = require('express');
const router = express.Router();
const passport = require('passport');
const userValidator = require('../validators/users.validator');
const superAdminValidator = require('../validators/superAdmin.validator');
const userController = require('../controllers/users.controller');
const superAdminController = require('../controllers/superAdmin.controller');
const Authorization = require('../middlewares/authorize');
require('../middlewares/passport')(passport);
//public routes
router.post('/signUp', userValidator.signUpValidator, userController.signUp);
router.post('/signIn', userValidator.signInValidator, userController.signIn);
router.post('/forgetPassword', userValidator.forgetPassValidator, userController.forgetPassword);
router.post('/verifyOtp', userValidator.verifyOtpValidator, userController.verifyOtp);
router.post('/updatePassword', userValidator.updatePasswordValidator, userController.updatePassword);

//superadmin access
router.post('/addOwners', passport.authenticate('jwt', { session : false }), Authorization.authorize(['superAdmin']), superAdminValidator.addOwnersValidator, superAdminController.addOwners);
router.get('/getAllOwners', passport.authenticate('jwt', { session : false }), Authorization.authorize(['superAdmin']), superAdminController.getAllOwners);
router.post('/updateTravelsDetails', passport.authenticate('jwt', { session : false }), Authorization.authorize(['superAdmin']), superAdminValidator.updateTravelsDetailsValidator, superAdminController.updateTravelsDetails);
router.post('/addBusDetails', passport.authenticate('jwt', { session : false }), Authorization.authorize(['superAdmin']), superAdminValidator.addBusDetailsValidator, superAdminController.addBusDetails);
router.get('/travelsBuses', passport.authenticate('jwt', { session : false }), Authorization.authorize(['superAdmin']), superAdminValidator.travelsBusesValidator, superAdminController.travelsBuses);

module.exports = router;