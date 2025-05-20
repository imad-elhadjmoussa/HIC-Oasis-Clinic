const db = require("./../db/connection");

const getPatients = async () => {
    const [rows] = await db.query('SELECT * FROM patient');
    return rows;
};

const getPatientById = async (id) => {
    const [rows] = await db.query('SELECT * FROM patient WHERE id = ?', [id]);
    return rows[0]; // Return single patient object instead of array
};

const getPatientByNationalId = async (nationalId) => {
    const [rows] = await db.query('SELECT * FROM patients WHERE national_id = ?', [nationalId]);
    return rows[0];
};

const createPatient = async (patient) => {
    const mysqlDate = new Date(patient.date_of_birth).toISOString().split('T')[0];
    const query = `
        INSERT INTO patient (
            national_id_number, 
            first_name, 
            last_name, 
            date_of_birth, 
            gender, 
            phone_number, 
            email, 
            blood_type, 
            address
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        patient.national_id_number,
        patient.first_name,
        patient.last_name,
        mysqlDate,
        patient.gender,
        patient.phone_number,
        patient.email,
        patient.blood_type,
        patient.address
    ];

    try {
        const [result] = await db.query(query, values);
        return {
            ...patient,
            id: result.insertId
        };
    } catch (error) {
        console.error("Error creating patient:", error);
        throw error;
    }
};

const updatePatient = async (id, patient) => {
    console.log(patient);
    const mysqlDate = new Date(patient.date_of_birth).toISOString().split('T')[0];
    try {
        const [result] = await db.query(
            `UPDATE patient 
             SET 
                national_id_number = ?, 
                first_name = ?, 
                last_name = ?, 
                date_of_birth = ?, 
                gender = ?, 
                phone_number = ?, 
                email = ?, 
                blood_type = ?, 
                address = ?
             WHERE id = ?`,
            [
                patient.national_id_number,
                patient.first_name,
                patient.last_name,
                mysqlDate,
                patient.gender,
                patient.phone_number,
                patient.email,
                patient.blood_type,
                patient.address,
                id
            ]
        );

        if (result.affectedRows === 0) {
            throw new Error("Patient not found or no changes made.");
        }

        return { ...patient, id: id };
    } catch (error) {
        console.error("Error updating patient:", error);
        throw error;
    }
};

const deletePatient = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM patient WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            throw new Error("Patient not found.");
        }
        return true;
    } catch (error) {
        throw new Error("Can not delete this patient ");
    }
};

// Additional useful patient-specific queries
const searchPatients = async (searchTerm) => {
    const [rows] = await db.query(
        `SELECT * FROM patients 
         WHERE first_name LIKE ? OR last_name LIKE ? OR national_id LIKE ? OR phone LIKE ?`,
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
};

const getPatientsByBloodType = async (bloodType) => {
    const [rows] = await db.query('SELECT * FROM patients WHERE blood_type = ?', [bloodType]);
    return rows;
};

const getPatientMedicalRecords = async (patientId) => {
    const q = `
    SELECT 
        MedicalRecord.id,
        Patient.id AS patient_id,
        Patient.first_name,
        Patient.last_name,
        Patient.national_id_number,
        Company.company_name,
        Contract.contract_name
      FROM 
        MedicalRecord
      JOIN 
        Patient ON MedicalRecord.patient_id = Patient.id
      JOIN 
        Company ON MedicalRecord.company_id = Company.id
      JOIN 
        Contract ON MedicalRecord.contract_id = Contract.id
        where MedicalRecord.patient_id = ?`;
    const [rows] = await db.query(q, [patientId]);
    return rows;
};

module.exports = {
    getPatients,
    getPatientById,
    getPatientByNationalId,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients,
    getPatientsByBloodType,
    getPatientMedicalRecords
};