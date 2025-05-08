const userModel = require('../models/user.model');

const getUsers = async (req, res) => {
    try {
        const users = await userModel.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.getUserById(id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // 1. Check for missing fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // 2. Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        // 3. Validate password strength (at least 6 characters)
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }        
        // 5. Create new user
        const newUser = await userModel.createUser(req.body);
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { username, email, password } = req.body;

        // 2. Ensure at least one field is provided for update
        if (!username && !email && !password) {
            return res.status(400).json({ message: "At least one field is required for update" });
        }

        // 3. Validate email format if updating email
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }
        }

        // 5. Validate password strength if updating password
        if (password && password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // 6. Perform the update
        const updatedUser = await userModel.updateUser(id, req.body);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await userModel.deleteUser(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}