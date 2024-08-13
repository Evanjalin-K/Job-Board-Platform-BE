const express = require('express');
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');

const jobRouter = express.Router();

jobRouter.post('/add', auth.verifyToken, auth.isAdmin,jobController.addJob);
jobRouter.get('/recommendations', auth.verifyToken, jobController.recommendJobs);
jobRouter.get('/applied/jobs', auth.verifyToken, jobController.getAppliedJobs);
jobRouter.put('/status/update', auth.verifyToken, jobController.updateApplicationStatus)

jobRouter.get('/all', auth.verifyToken, jobController.getAllJobs);
jobRouter.get('/createdJobs', auth.verifyToken, jobController.getJobsCreatedByUser)

jobRouter.get('/:id', auth.verifyToken, jobController.getJob);
jobRouter.put('/:id', auth.verifyToken, jobController.updateJob);
jobRouter.delete('/:id', auth.verifyToken, jobController.deleteJob);
jobRouter.delete('/admin/delete/:id', auth.verifyToken,auth.isAdmin, jobController.deleteJobByUser)
jobRouter.delete('/withdraw/:id', auth.verifyToken, jobController.deleteApplication);

jobRouter.post('/:id/apply', auth.verifyToken, jobController.applyJob);
module.exports = jobRouter;