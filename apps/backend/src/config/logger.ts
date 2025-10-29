import { createLogger, format, transports } from "winston";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const { combine, timestamp, printf, colorize } = format;

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

// Путь к логам
const logDir = path.join(__dirname, "../../logs");

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

export const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    colorize(),
    logFormat
  ),
  transports: [
    new transports.Console(), // вывод в консоль
    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }), // ошибки
    new transports.File({ filename: path.join(logDir, "combined.log") }), // все логи
  ],
});

// Для dev-режима
if (process.env.NODE_ENV !== "production") {
  logger.debug("Logger initialized in development mode");
}
