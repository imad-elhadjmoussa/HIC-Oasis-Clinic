
const db = require('../db/connection');

const createMedicalRecordPrestation = async (data) => {
    const { specialty_id, medical_record_id, prestation_id, doctor_id } = data;

    const [medical_record] = await db.query(
        `SELECT contract_id FROM MedicalRecord WHERE id = ?`,
        [medical_record_id]
    );

    // Step 1: Get the PrestationPrice ID
    const prestation_price_id = await getPrestationPrice(medical_record[0].contract_id, specialty_id, prestation_id);
    console.log("Prestation Price ID:", prestation_price_id);

    if (!prestation_price_id) {
        throw new Error("No prestation price found for the provided parameters.");
    }

    // Step 2: Insert into Prestation table
    const insertQuery = `
      INSERT INTO Prestation (
        medical_record_id,
        price_prestation_id,
        doctor_id
      ) VALUES (?, ?, ?)
    `;

    const [insertResult] = await db.query(insertQuery, [
        medical_record_id,
        prestation_price_id,
        doctor_id
    ]);

    const prestationId = insertResult.insertId;

    // Step 3: Fetch related info using the inserted prestation ID
    const selectQuery = `
      SELECT 
        Prestation.id,
        PrestationList.prestation_name,
        PrestationList.prestation_code,
        Specialty.specialty_name,
        PrestationPrice.patient_part
      FROM Prestation
      JOIN PrestationPrice ON Prestation.price_prestation_id = PrestationPrice.id
      JOIN PrestationList ON PrestationPrice.prestation_list_id = PrestationList.id
      JOIN Specialty ON PrestationList.specialty_id = Specialty.id
      WHERE Prestation.id = ?
    `;

    const [rows] = await db.query(selectQuery, [prestationId]);

    return {
        prestationId,
        ...rows[0],
    };
};


const getPrestationPrice = async (contractId, specialtyId, prestationId) => {
    const query = `
        SELECT PrestationPrice.id
        FROM PrestationPrice
        JOIN Annex ON PrestationPrice.annex_id = Annex.id
        WHERE Annex.contract_id = ?
        AND Annex.specialty_id = ?
        AND PrestationPrice.prestation_list_id = ?
    `;

    try {
        // First attempt with the provided contractId
        const [primaryRows] = await db.query(query, [contractId, specialtyId, prestationId]);
        console.log(primaryRows);

        if (primaryRows.length > 0) {
            return primaryRows[0].id;
        }

        // Fallback to contract_id = 1
        const [fallbackRows] = await db.query(query, [1, specialtyId, prestationId]);

        if (fallbackRows.length > 0) {
            return fallbackRows[0].id;
        }

        // If nothing is found, return null
        return null;
    } catch (error) {
        console.error("Error retrieving prestation price ID:", error.message);
        throw error;
    }
};

const getPrestationsMediclRecord = async (medical_record_id) => {
    const query = `
        SELECT 
            Prestation.id,
            PrestationList.prestation_name,
            PrestationList.prestation_code,
            Specialty.specialty_name,
            PrestationPrice.patient_part
        FROM Prestation
        JOIN PrestationPrice ON Prestation.price_prestation_id = PrestationPrice.id
        JOIN PrestationList ON PrestationPrice.prestation_list_id = PrestationList.id
        JOIN Specialty ON PrestationList.specialty_id = Specialty.id
        WHERE Prestation.medical_record_id = ?
    `;

    const [rows] = await db.query(query, [medical_record_id]);
    return rows;
}



module.exports = {
    createMedicalRecordPrestation,
    getPrestationsMediclRecord,
}
