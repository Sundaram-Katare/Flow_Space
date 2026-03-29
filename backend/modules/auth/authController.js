
export default registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!email || !password) {
            
        }
    } catch (err) {
        return res.status(500).json({ message: "Error Registering User", err });
    }
};