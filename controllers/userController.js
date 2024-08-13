const User = require("../models/user")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require("../utils/config");
const BasicInfo = require("../models/basicInfo");
const ProfessionalInfo = require("../models/professional_Info");
const nodemailer = require('nodemailer');
const { request, response } = require("express");


const userController = {

register: async (request, response) => {
    try {
        const { fname, lname, email, password } = request.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ fname, lname, email, password: hashPassword });

        // Save the new user
        const savedUser = await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({ _id: savedUser._id }, SECRET_KEY, { expiresIn: '1d' });

        // Set the token in a cookie
        response.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None', 
            expires: new Date(Date.now() + 24 * 3600000) // 1 day
        });

        console.log(token);

        // Send response
        response.status(201).json({ message: 'User Created Successfully', user: savedUser });
    } catch (error) {
        console.error('Registration error:', error);
        response.status(500).json({ message: 'Internal Server Error' });
    }
},

basicInfo: async (request, response) => {
  try {
      const userId = request.userId;
      const { phone, city, state, country } = request.body;

      console.log('Request body:', request.body);
      console.log('User ID:', userId);

      let basicInfo = await BasicInfo.findOne({ user: userId });

      if (!basicInfo) {
          basicInfo = new BasicInfo({ user: userId });
      }

      if (phone) basicInfo.phone = phone;
      if (city) basicInfo.city = city;
      if (state) basicInfo.state = state;
      if (country) basicInfo.country = country;

      const updatedBasicInfo = await basicInfo.save();
      console.log('Updated BasicInfo:', updatedBasicInfo);

      response.status(200).send({ message: 'Basic info updated successfully', user: updatedBasicInfo });
  } catch (error) {
      console.error('Error updating basic info:', error.message || error);
      response.status(500).json({ message: error.message || 'An error occurred while updating basic info' });
  }
},
updateBasicInfo: async (request, response) => {
  try {
    const userId = request.userId;
    const { phone, city, state, country } = request.body;

    // Log the incoming request data
    console.log('Request body:', request.body);
    console.log('User ID:', userId);

    // Find or create BasicInfo document
    let basicInfo = await BasicInfo.findOne({ user: userId });

    if (!basicInfo) {
      basicInfo = new BasicInfo({ user: userId });
    }

    // Update the fields if they are provided
    if (phone) {
      // Optional: Add a check here for phone number format if needed
      basicInfo.phone = phone;
    }
    if (city) {
      // Add a check here for city format if needed
      basicInfo.city = city;
    }
    if (state) {
      basicInfo.state = state;
    }
    if (country) {
      // Add a check here for country format if needed
      basicInfo.country = country;
    }

    // Save the updated BasicInfo document
    const updatedBasicInfo = await basicInfo.save();
    console.log('Updated BasicInfo:', updatedBasicInfo);

    response.status(200).send({ message: 'Basic info updated successfully', user: updatedBasicInfo });
  } catch (error) {
    console.error('Error updating basic info:', error.message || error);
    response.status(500).json({ message: error.message || 'An error occurred while updating basic info' });
  }
},
getBasicInfo: async (request, response) => {
  try {
      const userId = request.userId; 

      if (!userId) {
          return response.status(400).json({ message: 'User ID is required' });
      }

      const basicInfo = await BasicInfo.findOne({ user: userId });

      if (!basicInfo) {
          return response.status(404).json({ message: 'Basic information not found' });
      }

      response.status(200).json(basicInfo);
  } catch (error) {
      console.error('Error fetching basic info:', error.message || error);
      res.status(500).json({ message: error.message || 'An error occurred while fetching basic info' });
  }
},

professionalInfo: async (request, response) => {
  try {
      const userId = request.userId; 
      const { degree, field, institution, graduationYear, certifications, skills, preferredLocations, desiresIndustries, employementType, currentJob, experience, salaryExpectation } = request.body;

      let professionalInfo = await ProfessionalInfo.findOne({ user: userId });

      if (!professionalInfo) {

          // If ProfessionalInfo does not exist, create a new one

          professionalInfo = new ProfessionalInfo({ user: userId });
      }

      // Update the professional info

      if (degree) professionalInfo.degree = degree;
      if (field) professionalInfo.field = field;
      if (institution) professionalInfo.institution = institution;
      if (graduationYear) professionalInfo.graduationYear = graduationYear;
      if (certifications) professionalInfo.certifications = certifications;
      if (skills) professionalInfo.skills = skills;
      if (preferredLocations) professionalInfo.preferredLocations = preferredLocations;
      if (desiresIndustries) professionalInfo.desiresIndustries = desiresIndustries;
      if (employementType) professionalInfo.employementType = employementType;
      if (currentJob) professionalInfo.currentJob = currentJob;
      if (experience) professionalInfo.experience = experience;
      if (salaryExpectation) professionalInfo.salaryExpectation = salaryExpectation;
      
      const updatedProfessionalInfo = await professionalInfo.save();

      response.status(200).send({ message: 'Professional info updated successfully', user: updatedProfessionalInfo });
  } catch (error) {
      console.error('Error updating professional info:', error);
      response.status(500).json({ message: error.message });
  }
},
getProfessionalInfo: async (request, response) => {
  try {
    const userId = request.userId; // Assume userId is set by authentication middleware

    if (!userId) {
      return response.status(400).json({ message: 'User ID is required' });
    }

    const professionalInfo = await ProfessionalInfo.findOne({ user: userId })
      .populate('jobApplied') // Populate Job
      .populate('savedJob') // Populate savedJob
      .populate('recentlyViewedJob'); // Populate job recently viewed

    if (!professionalInfo) {
      return response.status(404).json({ message: 'Professional information not found' });
    }

    response.status(200).json(professionalInfo);
  } catch (error) {
    console.error('Error fetching professional info:', error.message || error);
    response.status(500).json({ message: 'An error occurred while fetching professional info' });
  }
},
updateProfessionalInfo: async (request, response) => {
  try {
    const userId = request.userId; 
    const updateData = request.body; 

    if (!userId) {
      return response.status(400).json({ message: 'User ID is required' });
    }

    const updatedProfessionalInfo = await ProfessionalInfo.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedProfessionalInfo) {
      return response.status(404).json({ message: 'Professional information not found' });
    }

    response.status(200).json(updatedProfessionalInfo);
  } catch (error) {
    console.error('Error updating professional info:', error.message || error);
    response.status(500).json({ message: 'An error occurred while updating professional info' });
  }
},

  login: async(request, response) => {
    try {
        const {email, password} = request.body;

        const user = await User.findOne({email})

        if(!user) {
            response.status(404).send({ message:'User not found' });
        }
         
        //compare the password from database and UI
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid)
        {
            return response.status(400).send( {message:'Invalid Password'} )
        }

        const token = jwt.sign({ _id: user._id }, SECRET_KEY);
        
        console.log('Login Token', token);

        response.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSites: 'none',
            expires: new Date(Date.now() + 24 * 3600000)
        });
        response.status(200).json({message: 'Login Successfull'})
    } catch (error) {
       response.status(500).send( {message: error.message} );
    
    }
  },
  logout: async (request, response) =>{
    try {
      response.clearCookie('token')

      response.status(200).json({message: 'Logged out successfully'})
    } catch (error) {
      response.status(500).json({message:error.message})
    }
  },
  getProfile: async (request, response) => {
       try {

        const userId = request.userId;

        const user = await User.findById(userId).select('-password -__v ');
        
        if(!user)
          return response.status(404).json({message: 'User not found'})

        response.status(200).json({message: 'User Profile', user})
       } catch (error) {
        response.status(500).json({message: error.message})
       }
  },
  updateProfile: async (request, response) => {
    try {
      const userId = request.userId;
      const { fname, lname, email } = request.body;

      const user = await User.findById(userId); 

      if(!user){
        return response.status(404).send({message: 'User not found'})
      }

      if(fname) user.fname = fname;
      if(lname) user.lname = lname;
      if(email) user.email = email;

      const updatedUser = await user.save();

      response.status(200).json({ message: 'User updated successfully', user: updatedUser})
    } catch (error) {
      response.status(500).send({ message: error.mesage })
    }
  },
  getProfile: async (request, response) => {
    try {
      const userId = request.userId;

      const user = await User.findById(userId). select('-password -__v -_id');

      if (!user) {
        return response.status(404).send({message: 'User not found'});
      }

      response.status(200).json({message: 'User Profile', user})
    } catch (error) {
      
    }
  },
  getProfilePicture: async (request, response) => {
    try {
      
    } catch (error) {
      response.status(500).json({message: error.message})
      
    }
  },
  deleteUser: async (request, response) => {
    try {
      const userId = request.params.id;

      const user = await User.findById(userId);

      if(!user) {
        return response.status(404).json({message: 'User not found'});

      }

      await User.findByIdAndDelete(userId);

      response.status(200).json({message: 'User deleted successfully'})

    } catch (error) {
      
    }
  },
  getAllUser: async (request, response) => {
    try {
      const { email } = request.query;

      if (email){
        const user = await User.findOne({ email })
        
        if (!user){
          return response.status(404).send({mesage: 'User not found'})
        }
      }
      const users = await User.find()

      response.status(200).json(users);
    } catch (error) {
      response.status(500).json({message: error.message})
    }
  },
  setProfilePicture: async (request, response) => {
    try {
        if (!request.file) {
            return response.status(400).json({ error: 'No file uploaded' });
        }

        const userId = request.userId;
        const profilePicture = request.file.path;

        const user = await User.findByIdAndUpdate(userId, { profilePicture }, { new: true });

        if (!user) {
            return response.status(404).json({ error: 'User not found' });
        }

        response.status(200).json({ user });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        response.status(500).json({ error: 'Failed to update profile picture' });
    }
},
forgotPassword: async (request, response) => {
  const { email } = request.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return response.status(404).json({ message: 'User not found' });
      }

      const token = jwt.sign({ email, }, SECRET_KEY, { expiresIn: '15min' });
      await sendVerificationEmail(email, token);
      console.log(token);

      response.status(200).json({ message: 'Password reset email sent. Please check your email.' });
  } catch (error) {
      console.error('Error in forgetPassword:', error);
      response.status(500).json({ message: 'Server error. Please try again later.' });
  }
},

updatePassword: async (request, response) => {
  try {
      const { token } = request.params;
      const { newPassword, confirmPassword } = request.body;

      if (newPassword !== confirmPassword) {
          return response.status(400).send('Passwords do not match.');
      }

      const decoded = jwt.verify(token, SECRET_KEY);

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const user = await User.findOneAndUpdate(
          { email: decoded.email }, 
          { password: hashedPassword }
      );

      if (!user) {
          return response.status(404).json({ message: 'User not found' });
      }

      return response.status(200).json({ message: 'Password updated successfully' });
     
  } catch (error) {
      console.error('Error in updatePassword:', error);
      if (error.name === 'JsonWebTokenError') {
          return response.status(400).json({ message: 'Invalid token' });
      }
      return response.status(500).json({ message: 'Server error. Please try again later.' });
  }
},
}
async function sendVerificationEmail(email, token) {

try {
  const URL = `http://localhost:5173/user/updatePassword/${token}`
  console.log(URL);
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'etest2882@gmail.com',
          pass: 'lmin eppu cgbk gnoz'
      }
  });

  let mailOptions = {
      from: 'etest2882@gmail.com',
      to: email,
      subject: 'Password Reset Link',
      html: `<p>Dear user,</p>
          <p>We received a request to reset your password. Please click the link below to reset it:</p>
          <p><a href=${URL}>Reset Password</a></p>
          <p>If you didn't request this, you can ignore this email.</p>
          <p>Thank you,</p>
          <p>Your App Team</p>`
  };

  await transporter.sendMail(mailOptions);
} catch (error) {
  console.error('Error sending password reset email:', error);
  throw error;
}
}


module.exports= userController;