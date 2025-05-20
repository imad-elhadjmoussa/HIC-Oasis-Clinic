
const db = require('../db/connection'); // Import the database connection
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and tt password are required" });
        }

        // 2. Fetch user + join role
        const [rows] = await db.query(`
      SELECT user.id, user.password, user.status, user.role_id, role.role_name AS role_name
      FROM user
      JOIN role ON user.role_id = role.id
      WHERE user.email = ?
      LIMIT 1
    `, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = rows[0];
        console.log(user);

        // 3. Check account status
        if (user.status !== 'active') {
            return res.status(403).json({ message: "Account is inactive" });
        }

        // 4. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }


        // 5. Set session
        req.session.userId = user.id;
        req.session.roleName = user.role_name;

        res.status(200).json({ message: "Login successful", role: user.role_name });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const logout = (req, res) => {
    console.log("Logout request received");
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out.' });
        }

        // Optionally, clear the session cookie (if using cookies for session)
        res.clearCookie('connect.sid'); // Assuming the cookie name is 'connect.sid'

        // Send a response confirming logout
        res.status(200).json({ message: 'Logged out successfully' });
    });
};

const checkSession = (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });
    console.log(req.session.userId, req.session.roleName);
    res.json({
        userId: req.session.userId,
        role: req.session.roleName
    });
}




module.exports = {
    login,
    logout,
    checkSession
};