const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const Application = require('../models/Application');

let mongoServer;
let token;
let userId;

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

    // Create test user and get token
    const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    });
    userId = user._id;
    token = user.getSignedJwtToken();
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
    await Application.deleteMany({});
});

describe('Application Endpoints', () => {
    describe('POST /api/v1/applications', () => {
        it('should create a new application', async () => {
            const res = await request(app)
                .post('/api/v1/applications')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    collegeName: 'Test University',
                    deadline: '2024-12-31',
                    status: 'in-progress',
                    requirements: [
                        { name: 'Common App', completed: true },
                        { name: 'Transcripts', completed: false }
                    ],
                    applicationFee: 75,
                    notes: 'Test application'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.data.collegeName).toBe('Test University');
            expect(res.body.data.requirements).toHaveLength(2);
        });

        it('should not create application without authentication', async () => {
            const res = await request(app)
                .post('/api/v1/applications')
                .send({
                    collegeName: 'Test University',
                    deadline: '2024-12-31'
                });

            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/v1/applications', () => {
        beforeEach(async () => {
            await Application.create([
                {
                    user: userId,
                    collegeName: 'University One',
                    deadline: '2024-12-31',
                    status: 'in-progress'
                },
                {
                    user: userId,
                    collegeName: 'University Two',
                    deadline: '2024-11-30',
                    status: 'submitted'
                }
            ]);
        });

        it('should get all applications for user', async () => {
            const res = await request(app)
                .get('/api/v1/applications')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveLength(2);
            expect(res.body.data[0].collegeName).toBe('University One');
        });

        it('should filter applications by status', async () => {
            const res = await request(app)
                .get('/api/v1/applications?status=submitted')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0].collegeName).toBe('University Two');
        });
    });

    describe('PUT /api/v1/applications/:id', () => {
        let applicationId;

        beforeEach(async () => {
            const application = await Application.create({
                user: userId,
                collegeName: 'Update University',
                deadline: '2024-12-31',
                status: 'in-progress'
            });
            applicationId = application._id;
        });

        it('should update application', async () => {
            const res = await request(app)
                .put(`/api/v1/applications/${applicationId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    status: 'submitted',
                    notes: 'Updated notes'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.status).toBe('submitted');
            expect(res.body.data.notes).toBe('Updated notes');
        });

        it('should not update application of another user', async () => {
            const otherUser = await User.create({
                name: 'Other User',
                email: 'other@example.com',
                password: 'password123'
            });
            const otherToken = otherUser.getSignedJwtToken();

            const res = await request(app)
                .put(`/api/v1/applications/${applicationId}`)
                .set('Authorization', `Bearer ${otherToken}`)
                .send({
                    status: 'submitted'
                });

            expect(res.statusCode).toBe(403);
        });
    });

    describe('DELETE /api/v1/applications/:id', () => {
        let applicationId;

        beforeEach(async () => {
            const application = await Application.create({
                user: userId,
                collegeName: 'Delete University',
                deadline: '2024-12-31',
                status: 'in-progress'
            });
            applicationId = application._id;
        });

        it('should delete application', async () => {
            const res = await request(app)
                .delete(`/api/v1/applications/${applicationId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            
            const application = await Application.findById(applicationId);
            expect(application).toBeNull();
        });

        it('should not delete non-existent application', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .delete(`/api/v1/applications/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(404);
        });
    });
});
