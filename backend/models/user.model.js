const db = require("./../db/connection")

const getUsers = async () => {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
}

const getUserById = async (id) => {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);
    return rows;
}

const createUser = async (user) => {
    const query = `
        INSERT INTO users (username, email, password, role, phone, status) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [user.username, user.email, user.password, user.role, user.phone, user.status];

    try {
        const [result] = await db.query(query, values);
        return {
            ...user,
            user_id: result.insertId
        };
    } catch (error) {
        console.error("Error inserting user:", error);
        throw error;
    }
};

const updateUser = async (id, user) => {
    try {
        const [result] = await db.query(
            `UPDATE users 
             SET username = ?, email = ?, phone = ?, role = ?, status = ? ,password = ?
             WHERE user_id = ?`,
            [user.username, user.email, user.phone, user.role, user.status,user.password, id]
        );

        if (result.affectedRows === 0) {
            throw new Error("User not found or no changes made.");
        }

        return { ...user, user_id: id };
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