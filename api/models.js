import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    icon: { type: String, required: true }, // Base64 or URL
});

const ExperienceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company_name: { type: String, required: true },
    icon: { type: String, required: true },
    iconBg: { type: String },
    date: { type: String },
    points: [{ type: String }]
});

const TestimonialSchema = new mongoose.Schema({
    testimonial: { type: String, required: true },
    name: { type: String, required: true },
    designation: { type: String },
    company: { type: String },
    image: { type: String }
});

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{
        name: { type: String },
        color: { type: String }
    }],
    image: { type: String, required: true },
    source_code_link: { type: String }
});

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
const Experience = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

const BlogSchema = new mongoose.Schema({
    title: String,
    topic: String,
    featured: Boolean,
    views: String,
    likes: String,
    comments: String,
    date: String,
    content: String
});
const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

const LeadershipSchema = new mongoose.Schema({
    organization: String,
    role: String,
    duration: String,
    description: String,
    achievements: [String],
    metrics1: String,
    metrics2: String,
    metrics3: String,
    metrics4: String
});
const Leadership = mongoose.models.Leadership || mongoose.model('Leadership', LeadershipSchema);

const CertificateSchema = new mongoose.Schema({
    title: String,
    description: String,
    organization: String,
    date: String,
    image: String,
    credentialLink: String
});
const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);

const AchievementSchema = new mongoose.Schema({
    category: String,
    title: String,
    description: String,
    date: String
});
const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);

const GlobalContentSchema = new mongoose.Schema({
    heroName: String,
    heroTitle: String,
    heroDescription: String,
    aboutIntro: String,
    aboutText: String,
    worksIntro: String,
    worksText: String,
    contactEmail: String,
    contactPhone: String,
    contactLocation: String,
    socialLinkedin: String,
    socialGithub: String,
    socialLeetcode: String,
    socialPortfolio: String,
});
const GlobalContent = mongoose.models.GlobalContent || mongoose.model('GlobalContent', GlobalContentSchema);

export { Service, Experience, Testimonial, Project, Blog, Leadership, Certificate, Achievement, GlobalContent };
