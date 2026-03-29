import pool from "../../db/db.js";
import bcrypt from 'bcryptjs';
import generateToken from "../../services/jwt.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [name, email, hashedPassword]);

        const token = generateToken(newUser.rows[0]);

        return res.status(201).json({ message: "User Registered Successfully", user: newUser.rows[0], token });
    } catch (err) {
        return res.status(500).json({ message: "Error Registering User", err });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingUser.rows.length == 0) {
            return res.status(400).json({ message: "No User with this email" });
        }

        const user = existingUser.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const token = generateToken(user);

        return res.status(200).json({ message: "Login Successful", user, token });
    } catch (err) {
        return res.status(500).json({ message: "Error in Login", err });
    }
}