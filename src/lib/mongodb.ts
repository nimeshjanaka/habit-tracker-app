import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined .")
}


let cached = (global as any).mongoose || { conn: null, promise: null }

export const connectMongoDB = async () => {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        }).then((mongoose) => {
            console.log("Connected to MongoDB")
            return mongoose
        })
    }

    cached.conn = await cached.promise
    return cached.conn
}

if (process.env.NODE_ENV !== "production") {
    ; (global as any).mongoose = cached
}
