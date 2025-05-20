const db = require("../db/connection");

function convertToMySQLDate(ddmmyyyy) {
    const [day, month, year] = ddmmyyyy.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}


const getDoctors = async () => {
    const [rows] = await db.query("SELECT * FROM Doctor");
    return rows;
};

const getDoctorById = async (doctorId) => {
    const [rows] = await db.query("SELECT * FROM Doctor WHERE id = ?", [doctorId]);
    return rows[0] || null;
};

const createDoctor = async (data) => {
    // Convert date_of_birth to MySQL date format

    const {
        first_name,
        last_name,
        national_id_number,
        date_of_birth,
        phone_number,
        email,
        gender,
        specialty_id
    } = data;
    const mysqlDate = new Date(date_of_birth).toISOString().split('T')[0];
    const [result] = await db.query(`
        INSERT INTO Doctor 
        (first_name, last_name, national_id_number, date_of_birth, phone_number, email, gender, specialty_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [first_name, last_name, national_id_number, mysqlDate, phone_number, email, gender, specialty_id]);

    return { id: result.insertId, ...data };
};

const updateDoctor = async (doctorId, data) => {
    console.log(data);
    const {
        first_name,
        last_name,
        national_id_number,
        date_of_birth,
        phone_number,
        email,
        gender,
        specialty_id
    } = data;
    const mysqlDate = new Date(date_of_birth).toISOString().split('T')[0];
    const [result] = await db.query(`
        UPDATE Doctor SET 
        first_name = ?, last_name = ?, national_id_number = ?, date_of_birth = ?, 
        phone_number = ?, email = ?, gender = ?, specialty_id = ?
        WHERE id = ?
    `, [first_name, last_name, national_id_number, mysqlDate, phone_number, email, gender, specialty_id, doctorId]);

    return result.affectedRows > 0 ? { id: doctorId, ...data } : null;
};

const deleteDoctor = async (doctorId) => {
    const [result] = await db.query("DELETE FROM Doctor WHERE id = ?", [doctorId]);
    return result.affectedRows > 0;
};

module.exports = {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
};
