import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, password } = req.body;

    const validUser = process.env.ADMIN_USERNAME;
    const validPass = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
    }

    if (username === validUser && password === validPass) {
        const token = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '1d' });
        return res.status(200).json({ token });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
}
