import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
    try {
        const id = user.id;

        const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '6h' });
        return token;
    } catch (error) {
        throw new Error('Error generating token');
    }
};

export default generateToken;