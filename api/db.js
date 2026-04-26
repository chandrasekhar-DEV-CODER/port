import mongoose from "mongoose";

let cachedDb = null;

export default async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env');
    }

    const db = await mongoose.connect(process.env.MONGODB_URI);

    cachedDb = db;
    return db;
}
