const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/config');
const User = require('../models/user')
const auth = {
    
    verifyToken: (request, response, next) => {
        try {

           const token = request.cookies.token

           console.log('Token', token);

           if(!token) {

            return response.status(401).send({ message:'Access denied' });

           }

           //verify the token
           try {
            
            const decodedToken = jwt.verify( token, SECRET_KEY,(err, decodedToken) => {
                if (err) {
                    console.error('Token verification failed:', err.message);
                    return response.status(401).json({ message: 'Invalid token' });
                }
            })

            console.log('Decode', decodedToken);

            request.userId = decodedToken._id;

            next();

           } catch (error) {
            return response.status(401).json( { message: 'Invalid token'})
           }
        } catch (error) {
            response.status(500).send({ message: error.message })
        }
    },
    isAdmin: async (request, response, next) => {
        try {
            const userId = request.userId;

            const user = await User.findById(userId);

            if (!user) {
                return response.status(404).send({ message: 'User not found' });
            }

            if (user.role !== 'admin') {
                return response.status(403).send({ message: 'Only admin has the access' });
            }

            next();
        } catch (error) {
            response.status(500).send({ message: error.message });
        }
    }
}
module.exports = auth;