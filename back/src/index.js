import express from "express";

const server = express();

server.listen(8000, "0.0.0.0", () => {
  console.log("Server listening on http://localhost:8000");
});
