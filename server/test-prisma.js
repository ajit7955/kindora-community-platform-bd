import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

console.log("User model:", typeof prisma.user);
console.log("Event model:", typeof prisma.event);
console.log("EventJoin model:", typeof prisma.eventJoin);

await prisma.$disconnect();
