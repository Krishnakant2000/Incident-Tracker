// @ts-nocheck
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const services = ['Backend', 'Frontend', 'Auth', 'Database', 'Payments'];
    const severities = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
    const statuses = ['OPEN', 'MITIGATED', 'RESOLVED'];

    const incidents = Array.from({ length: 200 }).map((_, i) => ({
        title: `Automated Incident Report #${i + 1}`,
        service: services[Math.floor(Math.random() * services.length)]!,
        severity: severities[Math.floor(Math.random() * severities.length)]!,
        status: statuses[Math.floor(Math.random() * statuses.length)]!,
        owner: Math.random() > 0.5 ? `engineer${i}@company.com` : null,
        summary: `This is a generated summary for incident ${i + 1}. System alerts triggered due to abnormal behavior.`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)), // Random past dates
    }));

    await prisma.incident.createMany({ data: incidents });
    console.log('Database seeded with 200 incidents!');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());