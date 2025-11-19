// src/prisma.service.ts
import { PrismaClient } from "../generated/prisma/client.js";

// Создаем единственный экземпляр клиента
const prisma = new PrismaClient();

export default prisma;
