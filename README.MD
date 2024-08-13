## **Job Board Platform ( Candidates Portal )** 

- The project is about to create a job board platform (candidates portal) by using

- Front-end: Reactjs
- Back-end: Nodejs
- Database: MongoDB

#### Functionality Development:

1. Users can make their profile on the home page using the form.
2. Users can browse and search for job opportunities based on their skills, preferences, and experiences.
3. Allows users to apply for job opportunities directly through the platform.
4. Provides personalized job recommendations based on the user's profile and search history to help them find      relevant opportunities.
5. Enables candidates to track the status of their job applications and manage their application history.
6. Sends notifications to users about new job opportunities (Through Email), application status updates, and other relevant information.

## This project includes home and dashboard pages. Each page has different components.
 
## Home: 

#### Registration:

The user can register by entering their first name, last name, email, and password.

- API Endpoint for the new user to register: http://localhost:3000/user/register

#### Basic Information:

- After the registration, the user has to add their basic information, like their phone number, city, state, and country.

- API Endpoint for adding the basic information: http://localhost:3000/user/basic

#### Professional Information:

- Once the basic information is done, the user has to add their professional information, like their degree, field, institution, graduation year, certification, skills, preferred location, desired industries, employment type, current job, experience, and salary expectations.

- API Endpint for adding the professional information: http://localhost:3000/user/prof

#### Login: 

- The user has to provide the registered email and password to login.

- API Endpoint for user login: http://localhost:3000/user/login

## Dashboard

- The dashboard contains Home, Jobs, User Profile, Application Status, Add Job, and Logout.

- This route will provide all the jobs and the recommended job for the user. The user can apply for the job by clicking the apply button.

- API Endpoint for recommended Job: http://localhost:3000/job/recommendations

#### Home

- The user can go back to the home page by clicking the home icon.

#### Jobs

- This route will provide all the jobs. The user can apply for the job by clicking the apply button.

- API Endpoint to view all the jobs: http://localhost:3000/job/all
- API Endpoint to apply the job: http://localhost:3000/job/:id/apply

#### User Profile

-This shows the user profile of the authenticated person. The user can update the profile, upload the profile picture, basic information and professional information.

- API Endpoint to get the user profile: http://localhost:3000/user/profile
- API Endpoint to upload the user profile picture: http://localhost:3000/user/profile/picture
- API Endpoint to update the profile: http://localhost:3000/user/profile/update

- API Endpoint to get the basic information of the authenticated user: http://localhost:3000/user/basic/info
- API Endpoint to get the professional information of the authenticated user: http://localhost:3000/user/basic/update

- API Endpoint to updtae the basic information: http://localhost:3000/user/basic/update
- API Endpoint to update the professional information: http://localhost:3000/user/professional/update

#### Application Status

- The user can get the applied job here and also find the status of the job. Here, the user can withdraw the job as well.

- API Endpoint to get the applied jobs by the user: http://localhost:3000/job/applied/jobs

- API Endpoint to withdraw the job by the user: http://localhost:3000/job/withdraw/:id

#### Add Jobs (Admin access)

- Here, the admin can add jobs and companies, delete the created job, and change the status of the job created by them.

- API Endpoint to add a new job: http://localhost:3000/job/add
- API Endpoint to add a new company: http://localhost:3000/company/add

- API Endpoint to update the status of the job applied by the candidates: http://localhost:3000/job/status/update

- API Endpoint to delete the job crerated by the admin: http://localhost:3000/job/admin/delete/:id

- The admin can also delete the job that she or he has created.






















