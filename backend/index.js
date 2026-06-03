const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');
require('./config/passport');
const router = require('./routes');

const DEFAULT_ALLOWED_ORIGINS = [
    'https://www.wifmart.com',
    'https://wifmart.com',
    'https://wifmart.vercel.app',
    'https://preorder-g9ne.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080'
];

let connectionPromise = null;

const normalizeOrigin = (value) => value?.trim().replace(/\/$/, '');

const getAllowedOrigins = () => {
    const configuredOrigins = (process.env.CORS_ORIGINS || '')
        .split(',')
        .map(normalizeOrigin)
        .filter(Boolean);

    const frontendOrigin = normalizeOrigin(process.env.FRONTEND_URL);

    return [...new Set([
        ...DEFAULT_ALLOWED_ORIGINS.map(normalizeOrigin),
        frontendOrigin,
        ...configuredOrigins
    ].filter(Boolean))];
};

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }

        connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        await connectionPromise;
        console.log('Connected to DB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    } finally {
        connectionPromise = null;
    }
};

// Connect initially
connectDB().catch(() => {});

const app = express();

app.set('trust proxy', 1);

// Reconnect only when Mongo drops, instead of reconnecting on every request.
app.use(async (req, res, next) => {
    if (mongoose.connection.readyState === 1) {
        return next();
    }

    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(503).json({
            success: false,
            message: 'Database connection unavailable.',
        });
    }
});

// Middleware
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = getAllowedOrigins();
        const originToMatch = normalizeOrigin(origin);

        if (allowedOrigins.includes(originToMatch)) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Preorder backend is running.',
    });
});

// Health check endpoint for UptimeRobot / Render pinging
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use("/api", router);

if (require.main === module) {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
