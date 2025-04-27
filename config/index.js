import dotenv from "dotenv";

dotenv.config();

const config = {
    PORT: process.env.PORT||4000,
    DB_URL: process.env.MONGODB_URL,
    SECRET: process.env.SESSION_SECRET,
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    }
}

export default config;