import app from './app';
import http from 'http';
import connectToDatabase from './database/connect';

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  console.log("Shutting down due to uncaught exception.");
  process.exit(1);
});

const server = http.createServer(app);

connectToDatabase(server);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection:", err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown on SIGTERM
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Shutting down gracefully...");
  server.close(() => {
    console.log("HTTP server closed.");
  });
});

// Graceful shutdown on SIGINT
process.on("SIGINT", () => {
  server.close(() => {
    console.log("HTTP server closed...");
  });
});
