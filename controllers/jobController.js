const Job = require("../models/job")
const Company = require("../models/company");
const ProfessionalInfo = require("../models/professional_Info")
const Application = require("../models/application")
const sendEmail = require("../middleware/nodemailer")
const User = require("../models/user");
const { response, request } = require("express");

const jobController = {
    addJob: async (request, response) => {
        try {
            const { title, company, description, skills, experience, salary } = request.body;
            const userId = request.userId;
    
            if (!title || !company || !description || !skills || !experience || !salary) {
                return response.status(400).json({ message: 'All fields are required.' });
            }
    
            const newJob = new Job({
                title,
                company,
                description,
                skills,
                experience,
                salary,
                createdBy: userId
            });
    
            const savedJob = await newJob.save();
    
            await Company.findByIdAndUpdate(company, {
                $push: { jobs: savedJob._id }
            });
    
            // Populate the job with company and creator details

            const populatedJob = await Job.findById(savedJob._id)
                .populate('company')
                .populate('createdBy');
    
            const users = await User.find({});
    
            await Promise.all(users.map(async (user) => {

                // Limit text description length for better readability

                const maxTextLength = 500;
                const descriptionText = populatedJob.description.length > maxTextLength 
                    ? `${populatedJob.description.slice(0, maxTextLength)}...` 
                    : populatedJob.description;
    
                // Format plain text email body
                const emailText = `
                    Hello ${user.fname || 'User'},
                    
                    We have a new job opportunity that might interest you:
                    Job Title: ${populatedJob.title}
                    Description: ${descriptionText}
                    Company: ${populatedJob.company.name}
                    Skills Required: ${populatedJob.skills.join(', ')}
                    Experience: ${populatedJob.experience}
                    Salary: ${populatedJob.salary}
                    
                    Visit our platform to apply or learn more about this opportunity.
                    
                    Best regards,
                    Jobee Team
                `;
    
                // Format HTML email body
                const htmlBody = `
                    <p>Hello ${user.fname || 'User'},</p>
                    
                    <p>We have a new job opportunity that might interest you:</p>
                    <p><strong>Job Title:</strong> ${populatedJob.title}</p>
                    <p><strong>Description:</strong><br>${populatedJob.description.replace(/\n/g, '<br>').slice(0, 1000)}${populatedJob.description.length > 1000 ? '...' : ''}</p>
                    <p><strong>Company:</strong> ${populatedJob.company.name}</p>
                    <p><strong>Skills Required:</strong> ${populatedJob.skills.join(', ')}</p>
                    <p><strong>Experience:</strong> ${populatedJob.experience}</p>
                    <p><strong>Salary:</strong> ${populatedJob.salary}</p>
                    
                    <p>Visit our platform to apply or learn more about this opportunity.</p>
                    
                    <p>Best regards,<br>Jobee Team</p>
                `;
    
                try {
                    await sendEmail(user.email, 'New Job Opportunity', emailText, htmlBody);
                } catch (emailError) {
                    console.error(`Failed to send email to ${user.email}:`, emailError);
                }
            }));
    
            response.status(201).json({
                message: 'Job created successfully and notifications sent',
                job: populatedJob
            });
        } catch (error) {
            console.error('Error creating job or sending notifications:', error);
            response.status(500).json({ message: 'Failed to create job or send notifications' });
        }
    },
    
getJob: async (request, response) => {
    try {
      const jobId = request.params.id;
      
      const job = await Job.findById(jobId).populate('company', 'name location');

      response.status(200).json({message:'Job', job})
    } catch (error) {
       response.status(500).json({message:error.message})
    }
},
getAllJobs: async (request, response) => {

 try {
    const jobs = await Job.find().populate('company', 'name location logoUrl');
    response.status(200).json(jobs)
 } catch (error) {
    response.status(500).json({message: error.message});
 }
},

getJobsCreatedByUser: async (req, res) => {
    try {
        const userId = req.userId;      
      // Fetch jobs created by the specified user

      const jobs = await Job.find({ createdBy: userId }).populate('company', 'name location logoUrl');
      
      if (!jobs) {
        return res.status(404).json({ message: 'No jobs found for this user' });
      }
      
      res.status(200).json({ jobs });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
updateJob: async(request, response) => {
    try {
        const {id} = request.params;
        const {title,company,description, skills, experience, salary} = request.body;

        const updatedJob = await Job.findByIdAndUpdate(id, {
        title,
        company,
        description,
        skills,
        experience,
        salary,
        }, {new: true});

        response.status(200).json({ message: 'Job updated successfully', job:updatedJob})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
},
deleteJob: async(request, response) => {
    try {
       const {id}  = request.params;

       await Job.findByIdAndDelete(id);

       response.status(200).json({message: 'Job deleted successfully'})
    } catch (error) {
       response.status(500).json({message: error.message})
    }
},

applyJob: async (request, response) => {
    try {
        const { id } = request.params; 
        const userId = request.userId; 

        // Validate inputs

        if (!id || !userId) {
            return response.status(400).json({ message: 'Job ID and User ID are required' });
        }

        // Find the job to apply for

        const job = await Job.findById(id).exec();
        if (!job) {
            return response.status(404).json({ message: 'Job not found' });
        }

        // Check if the user has already applied for this job

        const existingApplication = await Application.findOne({ userId, jobId: id }).exec();
        if (existingApplication) {
            return response.status(200).json({ message: 'You have already applied for this job' });
        }

        
        const newApplication = new Application({
            userId,
            jobId: id,
            status: 'Applied'
        });
        await newApplication.save();

        // Update the job's applicants list

        job.applicants.push(newApplication._id);
        await job.save();

        
        const populatedApplication = await Application.findById(newApplication._id)
            .populate({
                path: 'jobId',
                select: 'title status company' 
            })
            .populate({
                path: 'userId',
                select: 'name email' 
            })
            .exec();

        response.status(200).json({ message: 'Job applied successfully', application: populatedApplication });
    } catch (error) {
        console.error("Error applying for job:", error);
        response.status(500).json({ message: 'Internal server error', error: error.message });
    }
},

recommendJobs: async (request, response) => {
    try {
      const userId = request.userId; 
      const professional = await ProfessionalInfo.findOne({ user: userId }).exec();
  
      if (!professional) {
        return response.status(404).json({ message: 'Professional information not found' });
      }
  
      const {
        skills,
        preferredLocations,
        desiresIndustries,
        employementType,
        salaryExpectation
      } = professional;
  
      let salaryRange = [0, Infinity];
  
      if (salaryExpectation) {
        const match = salaryExpectation.match(/₹([\d,]+) - ₹([\d,]+) per annum/);
        if (match) {
          salaryRange = match.slice(1).map(val => parseInt(val.replace(/,/g, ''), 10));
        }
      }
  
      let jobs = await Job.find({
        skills: { $in: skills },
        location: { $in: preferredLocations },
        industry: { $in: desiresIndustries },
        type: employementType,
        salary: { $gte: salaryRange[0], $lte: salaryRange[1] },
        status: 'open'
      }).populate('company').exec();
  
      if (jobs.length === 0) {
        jobs = await Job.find({
          $or: [
            { skills: { $in: skills } },
            { location: { $in: preferredLocations } },
            { industry: { $in: desiresIndustries } },
            { type: employementType },
            { salary: { $gte: salaryRange[0], $lte: salaryRange[1] } }
          ],
          status: 'open'
        }).populate('company').exec();
      }
  
      response.status(200).json(jobs); // Return just the jobs array
    } catch (error) {
      console.error('Error recommending jobs:', error);
      response.status(500).json({ message: 'An error occurred while recommending jobs.' });
    }
  },

getAppliedJobs: async (request, response) => {
    try {
        const userId = request.userId; 

        if (!userId) {
            return response.status(400).json({ message: 'User ID is required' });
        }

        const applications = await Application.find({ userId })
            .populate({
                path: 'jobId',
                select: 'title status company logoUrl type experience salary', 
                populate: {
                    path: 'company',
                    select: 'name location logoUrl' 
                }
            })
            .exec();

        response.status(200).json(applications); 
    } catch (error) {
        console.error("Error fetching applications:", error);
        response.status(500).json({ message: error.message });
    }
},

updateApplicationStatus: async (request, response) => {
    const { applicationId, status } = request.body;

    if (!applicationId || !status) {
        return response.status(400).json({ message: 'Application ID and status are required' });
    }

    const validStatuses = ['Applied', 'Shortlisted', 'Rejected', 'Accepted'];
    if (!validStatuses.includes(status)) {
        return response.status(400).json({ message: 'Invalid status' });
    }

    try {
        const updatedApplication = await Application.findByIdAndUpdate(
            applicationId,
            { status },
            { new: true }
        )
        .populate({
            path: 'jobId',
            populate: {
                path: 'company'
            }
        })
        .populate('userId');

        if (!updatedApplication) {
            return response.status(404).json({ message: 'Application not found' });
        }

        const user = updatedApplication.userId;
        const job = updatedApplication.jobId;

        const emailText = `
            Hello ${user.fname},

            The status of your application for the job "${job.title}" at "${job.company.name}" has been updated to "${status}".

            Thank you for using our platform.

            Best regards,
            Jobee Team
        `;

        try {
            await sendEmail(user.email, 'Application Status Update', emailText);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
        }

        response.status(200).json({ message: 'Status updated successfully', updatedApplication });

    } catch (error) {
        console.error("Error updating application status:", error);
        response.status(500).json({ message: 'An error occurred while updating the application status' });
    }
},

deleteApplication: async (request, response) => {
    const { id } = request.params;

    try {
        const result = await Application.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Application not found' });
        }

        response.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error("Error deleting application:", error);
        response.status(500).json({ message: 'Internal Server Error' });
    }
},

getApplications: async (request, response) => {
    try {
        const jobs = await Job.find({ applicants: { $exists: true, $not: { $size: 0 } } }).populate('company').populate('applicants').lean().exec();

        response.status(200).json(jobs);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
},
deleteJobByUser: async (request, response) => {
    try {
        const jobId = request.params.id;
        const userId = request.userId;  

        const job = await Job.findById(jobId).populate('createdBy');

        if (!job) {
            return response.status(404).json({ message: 'Job not found' });
        }

        if (!job.createdBy._id.equals(userId)) {
            return response.status(403).json({ message: 'You are not authorized to delete this job' });
        }

        await Job.findByIdAndDelete(jobId);

        
        const companyUpdateResult = await Company.updateOne(
            { jobs: jobId },
            { $pull: { jobs: jobId } }
        );

        if (companyUpdateResult.nModified === 0) {
            console.warn('Job reference was not found in any company');
        }

        response.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        response.status(500).json({ message: 'Failed to delete job' });
    }
}
}


module.exports = jobController;