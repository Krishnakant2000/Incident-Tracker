import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// GET /api/incidents (Pagination, Filtering, Sorting)
app.get('/api/incidents', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const status = req.query.status as string;
        const severity = req.query.severity as string;
        const service = req.query.service as string;
        const sortBy = (req.query.sortBy as string) || 'createdAt';
        const sortOrder = (req.query.sortOrder as string) || 'desc';

        const skip = (page - 1) * limit;

        // Build the dynamic WHERE clause
        const where: any = {};
        if (search) where.title = { contains: search }; // SQLite contains is case-insensitive by default in Prisma
        if (status) where.status = status;
        if (severity) where.severity = severity;
        if (service) where.service = service;

        const [incidents, total] = await Promise.all([
            prisma.incident.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            prisma.incident.count({ where }),
        ]);

        res.json({
            data: incidents,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch incidents' });
    }
});

// GET /api/incidents/:id
app.get('/api/incidents/:id', async (req, res) => {
    const incident = await prisma.incident.findUnique({ where: { id: req.params.id } });
    if (!incident) return res.status(404).json({ error: 'Not found' });
    res.json(incident);
});

// POST /api/incidents
app.post('/api/incidents', async (req, res) => {
    const { title, service, severity, status, owner, summary } = req.body;
    if (!title || !service || !severity || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const incident = await prisma.incident.create({
        data: { title, service, severity, status, owner, summary },
    });
    res.status(201).json(incident);
});

// PATCH /api/incidents/:id
app.patch('/api/incidents/:id', async (req, res) => {
    try {
        const incident = await prisma.incident.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(incident);
    } catch (error) {
        res.status(400).json({ error: 'Update failed' });
    }
});

app.listen(3000, () => console.log('Backend running on port 3000'));