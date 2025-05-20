const db = require("./../db/connection")

function convertToMySQLDate(ddmmyyyy) {
    const [day, month, year] = ddmmyyyy.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}



const getUsers = async () => {
    const [rows] = await db.query('SELECT * FROM user');
    return rows;
}

const getUserById = async (id) => {
    const [rows] = await db.query('SELECT * FROM user WHERE id = ?', [id]);
    return rows;
}

const createUser = async (user) => {
    const query = `
        INSERT INTO user (
            first_name, last_name, national_id_number, date_of_birth,
            phone_number, email, gender, password, status, specialty_id, role_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const mysqlDate = new Date(user.date_of_birth).toISOString().split('T')[0];
    const values = [
        user.first_name,
        user.last_name,
        user.national_id_number,
        mysqlDate,
        user.phone_number,
        user.email || null,
        user.gender || null,
        user.password,
        user.status || 'active',
        user.specialty_id || null,
        user.role_id
    ];

    try {
        const [result] = await db.query(query, values);
        return {
            ...user,

            id: result.insertId
        };
    } catch (error) {
        console.error("Error inserting user:", error);
        throw error;
    }
};


const updateUser = async (id, user) => {
    try {
        const [result] = await db.query(
            `UPDATE user 
             SET first_name = ?, last_name = ?, national_id_number = ?, date_of_birth = ?, 
                 phone_number = ?, email = ?, gender = ?, password = ?, status = ?, 
                 specialty_id = ?, role_id = ?
             WHERE id = ?`,
            [
                user.first_name,
                user.last_name,
                user.national_id_number,
                convertToMySQLDate(user.date_of_birth),
                user.phone_number,
                user.email || null,
                user.gender || null,
                user.password,
                user.status || 'active',
                user.specialty_id || null,
                user.role_id,
                id
            ]
        );

        if (result.affectedRows === 0) {
            throw new Error("User not found or no changes made.");
        }

        return { ...user, id };
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, message: error.message };
    }
};


const deleteUser = async (id) => {
    const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [id]);
    return result;
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}