const Company = require("../models/company")


const companyController = {
addCompany: async (request, response) => {
    try {
        
        const userId = request.userId;

        const { name, location, logoUrl } = request.body;
    
        const newCompany = new Company({
            name,
            location,
            logoUrl,
            user:userId
        })
    
        const savedCompany = await newCompany.save();

        console.log(savedCompany);
    
        response.status(201).json({
            message: 'Company added successfully',
            company: savedCompany
        })  

    } catch (error) {
        response.status(500).json({ message: error.message })
    }  
},
getCompany: async (request, response) => {
    try {
        const companyId = request.params.id;

        const company = await Company.findById(companyId).populate('user', 'name email');

        response.status(200).json({message: 'Company',company});
    } catch (error) {
        response.status(500).send({message: error.message})
    }
},
getAllCompanies: async (request, response) => {
    try {
        const companies = await Company.find().exec();

        response.status(200).json(companies);
 
    } catch (error) {
        response.status(500).json({ message: error.message });

    }

},
updateCompany: async (request, response) => {
        try {
            const companyId = request.params.id;

            const { name, location, logoUrl } = request.body;

            const updatedCompany = await Company.findByIdAndUpdate(companyId, {
                name,
                location,
                logoUrl
            });

            response.status(200).send({
                message: 'Company updated successfully',
                company: updatedCompany
            });
        } catch (error) {
            response.status(500).send({ message: error.message });
        }
    },
deleteCompany: async (request, response) => {

    try {
    const companyId = request.params.id;

    await Company.findByIdAndDelete(companyId);

    response.status(200).send({message: 'Company deleted successfully'})

    } catch (error) {
    response.status(500).json({message: error.message})
    }
    
},
getCompanynames: async (request, response) => {
    try {
        const companies = await Company.find({}, 'name location');
        response.status(200).json(companies);
    } catch (error) {
        console.error('Error fetching companies:', error);
        response.status(500).json({ message: 'Failed to fetch companies' });
    }
},
getLogo: async (request, response) => {
    try {
        const companies = await Company.aggregate([
            {
                $group: {
                    _id: "$name",
                    logoUrl: { $first: "$logoUrl" }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    logoUrl: 1
                }
            }
        ]);

        response.json(companies);
    } catch (err) {
        response.status(500).json({ message: 'Error fetching companies', error: err });
    }
}


}

module.exports = companyController;