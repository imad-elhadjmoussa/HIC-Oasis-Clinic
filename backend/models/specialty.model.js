
const db = require("../db/connection");

const getSpecialties = async () => {
    const [rows] = await db.query("SELECT * FROM Specialty");
    return rows;
}

const getSpecialtyDetails = async (specialtyId) => {
    const [rows] = await db.query(
        `
        SELECT 
            Specialty.id AS specialty_id,
            Specialty.specialty_name,

            Doctor.id AS doctor_id,
            Doctor.first_name AS doctor_first_name,
            Doctor.last_name AS doctor_last_name,

            PrestationList.id AS prestation_id,
            PrestationList.prestation_name,
            PrestationList.prestation_code,

            WaitingRoom.id AS room_id,
            WaitingRoom.room_name,
            WaitingRoom.number

        FROM Specialty

        LEFT JOIN Doctor ON Doctor.specialty_id = Specialty.id
        LEFT JOIN PrestationList ON PrestationList.specialty_id = Specialty.id
        LEFT JOIN WaitingRoom ON WaitingRoom.id = PrestationList.waiting_room_id

        WHERE Specialty.id = ?
        `,
        [specialtyId]
    );

    if (rows.length === 0) return null;

    const specialty = {
        specialty_id: rows[0].specialty_id,
        specialty_name: rows[0].specialty_name,
        doctors: [],
        prestations: [],
        rooms: []
    };

    const doctorSet = new Set();
    const prestationSet = new Set();
    const roomSet = new Set();

    for (const row of rows) {
        // Add doctor if not already added
        if (row.doctor_id && !doctorSet.has(row.doctor_id)) {
            doctorSet.add(row.doctor_id);
            specialty.doctors.push({
                doctor_id: row.doctor_id,
                doctor_first_name: row.doctor_first_name,
                doctor_last_name: row.doctor_last_name
            });
        }

        // Add prestation if not already added
        if (row.prestation_id && !prestationSet.has(row.prestation_id)) {
            prestationSet.add(row.prestation_id);
            specialty.prestations.push({
                prestation_id: row.prestation_id,
                prestation_name: row.prestation_name,
                prestation_code: row.prestation_code
            });
        }

        // Add room if not already added
        if (row.room_id && !roomSet.has(row.room_id)) {
            roomSet.add(row.room_id);
            specialty.rooms.push({
                room_id: row.room_id,
                room_name: row.room_name,
                number: row.number
            });
        }
    }

    return specialty;
};

module.exports = {
    getSpecialties,
    getSpecialtyDetails
};
