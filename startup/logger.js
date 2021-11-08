import fs from "fs";
import "express-async-errors";

export function logger() {
  process.on("uncaughtException", (ex) => {
    const timestamp = new Date().toLocaleDateString(
      {},
      {
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
    fs.appendFileSync(
      "./logs/errors.log",
      `${timestamp} : ${JSON.stringify(ex.message)}\n`
    );
  });

  process.on("unhandledRejection", (rej) => {
    throw new Error(rej);
  });
}

export function log(log) {
  const timestamp = new Date().toLocaleDateString(
    {},
    {
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
  fs.appendFileSync("./logs/logs.log", `${timestamp} : ${log}\n`);
}

export default {
  log,
  logger,
};
