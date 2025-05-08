
const db = require('../db/connection'); // Import the database connection

const login = async (req, res) => {
    const { email, password } = req.body; // Fix: Use 'email' instead of 'username'
    console.log('email:', email, 'password:', password);

    try {
        // Check if all fields are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        // Query the database for a matching email and password
        const [users] = await db.query(
            'SELECT user_id, username, email,role FROM users WHERE email = ? AND password = ?',
            [email, password]
        );

        // If no user is found, return an error
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Return the user details (without the password)
        res.status(200).json({ message: 'Login successful', user: users[0] });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logout = (req, res) => {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};





module.exports = { login };