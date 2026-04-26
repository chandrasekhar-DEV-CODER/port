import connectToDatabase from './db.js';
import { Project, Experience, Service, Testimonial, Blog, Leadership, Certificate, Achievement, GlobalContent } from './models.js';
import jwt from 'jsonwebtoken';

const modelMap = {
    projects: Project,
    experiences: Experience,
    services: Service,
    testimonials: Testimonial,
    blogs: Blog,
    leadership: Leadership,
    certificates: Certificate,
    achievements: Achievement,
    global: GlobalContent
};

// Middleware-like function to verify JWT
const verifyToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';

    try {
        jwt.verify(token, jwtSecret);
        return true;
    } catch (error) {
        return false;
    }
};

export default async function handler(req, res) {
    // CORS Headers for Local Dev (Vercel will handle it on prod if configured, but good to have)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    await connectToDatabase();

    const { type, id } = req.query; // ?type=projects&id=...

    if (!type || !modelMap[type]) {
        return res.status(400).json({ message: 'Invalid type specified' });
    }

    const Model = modelMap[type];

    // GET requests are public
    if (req.method === 'GET') {
        try {
            if (type === 'global') {
                let globalData = await Model.findOne();
                if (!globalData) {
                    globalData = await Model.create({
                        heroName: "Adrian",
                        heroTitle: "3D Visuals, user interfaces and web applications",
                        heroDescription: "I develop 3D visuals, user interfaces and web applications",
                        aboutIntro: "Introduction",
                        aboutText: "I'm a skilled software developer with experience in TypeScript and JavaScript, and expertise in frameworks like React, Node.js, and Three.js. I'm a quick learner and collaborate closely with clients to create efficient, scalable, and user-friendly solutions that solve real-world problems. Let's work together to bring your ideas to life!",
                        worksIntro: "My work",
                        worksText: "Following projects showcases my skills and experience through real-world examples of my work. Each project is briefly described with links to code repositories and live demos in it. It reflects my ability to solve complex problems, work with different technologies, and manage projects effectively.",
                        contactEmail: "manojbavisetti75@gmail.com",
                        contactPhone: "+91-6305321506",
                        contactLocation: "Vizianagaram, Andhra Pradesh",
                        socialLinkedin: "https://linkedin.com/in/mkmanoj-dev",
                        socialGithub: "https://github.com/Manoj-9836",
                        socialLeetcode: "https://leetcode.com/u/Manoj9836",
                        socialPortfolio: "https://manoj-kumar-dev-502.vercel.app"
                    });
                }
                return res.status(200).json(globalData);
            }
            const data = await Model.find({});
            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    // Mutative requests require auth
    if (!verifyToken(req)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        switch (req.method) {
            case 'POST':
                const newData = new Model(req.body);
                await newData.save();
                return res.status(201).json(newData);

            case 'PUT':
                if (!id) return res.status(400).json({ message: 'ID required for PUT' });
                const updatedData = await Model.findByIdAndUpdate(id, req.body, { new: true });
                return res.status(200).json(updatedData);

            case 'DELETE':
                if (!id) return res.status(400).json({ message: 'ID required for DELETE' });
                await Model.findByIdAndDelete(id);
                return res.status(200).json({ message: 'Deleted successfully' });

            default:
                return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
