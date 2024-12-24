const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
    // Disconnect from any existing connection
    await mongoose.disconnect();
    
    // Create new in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connect to the in-memory database
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    // Clean up
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
});

beforeEach(async () => {
    await User.deleteMany({});
});

describe('Authentication Endpoints', () => {
    describe('POST /api/v1/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.success).toBe(true);
        });

        it('should not register user with existing email', async () => {
            await User.create({
                name: 'Existing User',
                email: 'test@example.com',
                password: 'password123'
            });

            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/auth/login', () => {
        beforeEach(async () => {
            await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
        });

        it('should login with correct credentials', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.success).toBe(true);
        });

        it('should not login with incorrect password', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/v1/auth/me', () => {
        let token;

        beforeEach(async () => {
            const user = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
            token = user.getSignedJwtToken();
        });

        it('should get current user profile', async () => {
            const res = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.email).toBe('test@example.com');
        });

        it('should not access profile without token', async () => {
            const res = await request(app)
                .get('/api/v1/auth/me');

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});
