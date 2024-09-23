const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');

jest.mock('@prisma/client');
const prisma = new PrismaClient();

describe('User API', () => {

    // Mock data
    const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    ];

    // Test the POST /users route
    it('should create a new user', async () => {
        const newUser = { name: 'Alice', email: 'alice@example.com' };

        prisma.user.create.mockResolvedValue({
            id: 3,
            ...newUser,
        });

        const res = await request(app).post('/users').send(newUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: newUser,
        });
    });

    // Test the GET /users route
    it('should return all users', async () => {
        prisma.user.findMany.mockResolvedValue(mockUsers);

        const res = await request(app).get('/users');

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(2);
        expect(prisma.user.findMany).toHaveBeenCalled();
    });

    // Test the GET /users/:id route
    it('should return a specific user', async () => {
        prisma.user.findUnique.mockResolvedValue(mockUsers[0]);

        const res = await request(app).get('/users/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockUsers[0]);
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        });
    });

    // Test the PUT /users/:id route
    it('should update a user', async () => {
        const updatedUser = { name: 'John Smith', email: 'johnsmith@example.com' };

        prisma.user.update.mockResolvedValue(updatedUser);

        const res = await request(app).put('/users/1').send(updatedUser);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(updatedUser);
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: updatedUser,
        });
    });

    // Test the DELETE /users/:id route
    it('should delete a user', async () => {
        prisma.user.delete.mockResolvedValue(mockUsers[0]);

        const res = await request(app).delete('/users/1');

        expect(res.statusCode).toEqual(204);
        expect(prisma.user.delete).toHaveBeenCalledWith({
            where: { id: 1 },
        });
    });
});