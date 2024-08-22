const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');

// Регистрация с реферальным кодом
router.post('/register', async (req, res) => {
    const { username, password, referralCode } = req.body;

    try {
        let user = await prisma.user.findUnique({
            where: { username },
        });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const referralUser = referralCode
            ? await prisma.user.findUnique({ where: { referralCode } })
            : null;

        user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                referralCode: generateReferralCode(),
                referredBy: referralUser ? { connect: { id: referralUser.id } } : undefined,
            },
        });

        if (referralUser) {
            await prisma.referral.create({
                data: {
                    userId: user.id,
                    referredBy: { connect: { id: referralUser.id } },
                },
            });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            'secret',
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Авторизация
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            'secret',
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Получение информации о пользователе
router.get('/user', async (req, res) => {
    const { userId } = req.query;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Получение информации о рефералах
router.get('/referrals', async (req, res) => {
    const { userId } = req.query;

    try {
        const referrals = await prisma.referral.findMany({
            where: { referredById: parseInt(userId) },
            include: { user: true },
        });

        res.json(referrals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Обновление баланса пользователя
router.post('/update-balance', async (req, res) => {
    const { userId, amount } = req.body;

    try {
        const user = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: {
                balance: {
                    increment: amount,
                },
            },
        });

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

function generateReferralCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}
