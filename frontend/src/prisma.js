const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function startMiningSession(userId, speed) {
    const session = await prisma.miningSession.create({
        data: {
            userId,
            speed,
        },
    });

    console.log('Mining session started:', session);
    return session;
}

async function endMiningSession(sessionId, amountMined) {
    const session = await prisma.miningSession.update({
        where: { id: sessionId },
        data: {
            endTime: new Date(),
            amountMined,
        },
    });

    const user = await prisma.user.update({
        where: { id: session.userId },
        data: {
            balance: {
                increment: amountMined,
            },
        },
    });

    console.log('Mining session ended:', session);
    console.log('User balance updated:', user);
    return session;
}

// Пример использования
(async () => {
    const userId = 'some-user-id'; // Замените на фактический идентификатор пользователя
    const speed = 'Low';

    // Начать сессию майнинга
    const session = await startMiningSession(userId, speed);

    // Завершить сессию майнинга и обновить баланс пользователя
    const amountMined = 0.000001 * 50; // Пример количества добытых средств
    await endMiningSession(session.id, amountMined);

    // Закрыть соединение с Prisma Client
    await prisma.$disconnect();
})();
