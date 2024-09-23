const mockPrisma = {
    user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

const PrismaClient = jest.fn(() => mockPrisma);

module.exports = {
    PrismaClient,
};