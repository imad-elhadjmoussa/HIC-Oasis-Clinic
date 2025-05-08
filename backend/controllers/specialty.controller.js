
const specialtyModel = require('../models/specialty.model');

const getSpecialties = async (req, res) => {
    try {
        const specialties = await specialtyModel.getSpecialties();
        res.status(200).json(specialties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getSpecialtyDetails = async (req, res) => {
    const specialtyId = req.params.specialtyId;
    try {
        const specialtyDetails = await specialtyModel.getSpecialtyDetails(specialtyId);
        if (!specialtyDetails) {
            return res.status(404).json({ message: 'Specialty not found' });
        }
        res.status(200).json(specialtyDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getSpecialties,
    getSpecialtyDetails
};