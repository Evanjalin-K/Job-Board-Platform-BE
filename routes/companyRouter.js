const express = require('express');
const auth = require('../middleware/auth');
const companyController = require('../controllers/companyController');


const companyRouter = express.Router();

companyRouter.get('/logo', companyController.getLogo);

companyRouter.get('/getnames', auth.verifyToken, companyController.getCompanynames)
companyRouter.post('/add', auth.verifyToken,auth.isAdmin, companyController.addCompany);
companyRouter.get('/get', auth.verifyToken, companyController.getAllCompanies);
companyRouter.get('/:id', companyController.getCompany);
companyRouter.post('/:id',auth.verifyToken, companyController.updateCompany);
companyRouter.delete('/:id', auth.verifyToken, companyController.deleteCompany)

module.exports = companyRouter;