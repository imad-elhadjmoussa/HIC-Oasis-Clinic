
const db = require('../db/connection.js');

const getMedicalsRecords = async () => {
  const [rows] = await db.query(`
      SELECT 
        MedicalRecord.id,
        MedicalRecord.status,
        MedicalRecord.created_at,
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
        Contract ON MedicalRecord.contract_id = Contract.id;
    `);
  return rows;
};


const getMedicalByRecord = async (id) => {
  // First, get the base medical record
  const [recordRows] = await db.query('SELECT * FROM MedicalRecord WHERE id = ?', [id]);
  if (recordRows.length === 0) return null;

  const record = recordRows[0];

  // Then get the prestation summary
  const q = `
    SELECT 
      COUNT(Prestation.id) AS prestation_count,
      SUM(PrestationPrice.patient_part) AS total_patient_part
    FROM MedicalRecord
    LEFT JOIN Prestation ON Prestation.medical_record_id = MedicalRecord.id
    LEFT JOIN PrestationPrice ON Prestation.price_prestation_id = PrestationPrice.id
    WHERE MedicalRecord.id = ?
    GROUP BY MedicalRecord.id;
  `;

  const [summaryRows] = await db.query(q, [id]);

  const summary = summaryRows[0] || { prestation_count: 0, total_patient_part: 0 };

  return {
    ...record,
    prestation_count: summary.prestation_count,
    total_patient_part: summary.total_patient_part
  };
}

const getMedicalByPatientId = async (patientId) => {
  const [rows] = await db.query('SELECT * FROM medical_records WHERE patient_id = ?', [patientId]);
  return rows[0];
}

const createMedical = async (medical) => {
  const date = new Date(medical.date_prise_en_charge);
  const formattedDate = date.toISOString().split('T')[0];
  const query = `
        INSERT INTO MedicalRecord (
            patient_id,
            company_id, 
            contract_id,
            date_prise_en_charge
        ) 
        VALUES (?, ?, ?, ?)
    `;
  const values = [
    parseInt(medical.patient_id),
    parseInt(medical.company_id),
    parseInt(medical.contract_id),
    formattedDate
  ];

  try {
    const [result] = await db.query(query, values);
    return {
      ...medical,
      id: result.insertId
    };
  } catch (error) {
    console.error("Error creating medical record:", error);
    throw error;
  }
}

const updateMedical = async (id, data) => {
  const fields = [];
  const values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  if (fields.length === 0) return null; // nothing to update

  const sql = `UPDATE MedicalRecord SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);

  const [result] = await db.query(sql, values);

  if (result.affectedRows === 0) return null;

  // optionally return updated row:
  const [updated] = await db.query(`SELECT * FROM MedicalRecord WHERE id = ?`, [id]);
  return updated[0];
};

const getMedicalRecordSummary = async (recordId) => {
  const q = `
      SELECT 
        MedicalRecord.id AS medical_record_id,
        COUNT(Prestation.id) AS prestation_count,
        SUM(PrestationPrice.patient_part) AS total_patient_part
      FROM MedicalRecord
      LEFT JOIN Prestation ON Prestation.medical_record_id = MedicalRecord.id
      LEFT JOIN PrestationPrice ON Prestation.price_prestation_id = PrestationPrice.id
      WHERE MedicalRecord.id = ?
      GROUP BY MedicalRecord.id;
    `;

  const [rows] = await db.query(q, [recordId]);
  return rows[0] || null;
};

const deleteMedical = async (id) => {
  try {
    const [result] = await db.query('DELETE FROM MedicalRecord WHERE id = ?', [id]);
    if (result.affectedRows === 0) return null; // No rows deleted, record not found
    return true; // Successfully deleted
  } catch (error) {
    throw new Error('You cannot delete this medical record because it have medical acts');
  }

};




module.exports = {
  getMedicalsRecords,
  getMedicalByRecord,
  getMedicalByPatientId,
  createMedical,
  updateMedical,
  getMedicalRecordSummary,
  deleteMedical
};