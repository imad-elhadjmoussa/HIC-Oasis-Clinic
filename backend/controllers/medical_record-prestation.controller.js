
const MedicalRecordPrestation = require('../models/medical_record-prestation.model');

const createMedicalRecordPrestation = async (req, res) => {
    const medical_record_prestation = await MedicalRecordPrestation.createMedicalRecordPrestation(req.body);
    res.status(201).json({
        message: "Medical record prestation created successfully",
        data: medical_record_prestation
    });
}

const getMedicalRecordPrestations = async (req, res) => {
    const medical_record_id = req.params.medical_record_id;
    const medical_record_prestations = await MedicalRecordPrestation.getPrestationsMediclRecord(medical_record_id);
    res.status(200).json(medical_record_prestations);
}



module.exports = {
    createMedicalRecordPrestation,
    getMedicalRecordPrestations,
    
}   