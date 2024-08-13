const express = require('express')
const userRouter = express.Router();
const userController = require("../controllers/userController");
const auth = require('../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, `./uploads/`)
    },
    filename: function (request, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const upload = multer({ storage: storage });

userRouter.post('/register',userController.register)
userRouter.post('/login', userController.login)


//Protected routes
userRouter.post('/basic',auth.verifyToken, userController.basicInfo);
userRouter.post('/professional',auth.verifyToken, userController.professionalInfo);
userRouter.get('/professional/info',auth.verifyToken, userController.getProfessionalInfo);
userRouter.put('/professional/update',auth.verifyToken, userController.updateProfessionalInfo);



userRouter.get('/', auth.verifyToken, auth.isAdmin, userController.getAllUser)
userRouter.get('/profile', auth.verifyToken, userController.getProfile);
userRouter.post('/logout', auth.verifyToken, userController.logout);
userRouter.get('/profile', auth.verifyToken, userController.getProfile);
userRouter.put('/profile/picture', auth.verifyToken, upload.single('profilePicture'), userController.setProfilePicture)
userRouter.put('/profile/update', auth.verifyToken, userController.updateProfile);
userRouter.delete('/:jobid', auth.verifyToken, userController.deleteUser);

//userRouter.put('/:id', auth.verifyToken, userController.updateUser);

userRouter.post('/basic', userController.basicInfo);
userRouter.put('/basic/update', auth.verifyToken, userController.updateBasicInfo);
userRouter.get('/basic/info', auth.verifyToken, userController.getBasicInfo);
userRouter.post('/:email', userController.forgotPassword);
userRouter.post('/updatepassword/:token', userController.updatePassword);
userRouter.post('/:id/prof', userController.professionalInfo);


module.exports = userRouter;
