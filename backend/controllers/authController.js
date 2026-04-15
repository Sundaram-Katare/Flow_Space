import { 
  createUser, 
  getUserByEmail,
  getUserById
} from "../Tables/users.js";
import { generateToken, verifyToken } from "../services/jwt.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: "Email, username, and password required" });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(
      email,
      username,
      hashedPassword,
      firstName || "",
      lastName || ""
    );

    const token = generateToken(user.id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user.id);

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({ error: "Failed to get user" });
  }
};

export const verifyTokenEndpoint = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ valid: false, error: "No token provided" });
    }

    const decoded = verifyToken(token);
    res.json({ valid: true, userId: decoded.userId });
  } catch (err) {
    res.status(401).json({ valid: false, error: "Invalid token" });
  }
};