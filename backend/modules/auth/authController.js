import pool from "../../db/db.js";
import bcrypt from 'bcryptjs';

export default registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if(existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [name, email, hashedPassword]);

        return res.status(201).json({ message: "User Registered Successfully", user: newUser.rows[0] });
    } catch (err) {
        return res.status(500).json({ message: "Error Registering User", err });
    }
};