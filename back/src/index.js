import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import UserRoute from "./routes/users.mjs"


dotenv.config();

if (!process.env.PORT) {
	process.exit(1);
}

const PORT = parseInt(process.env.PORT, 10);

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/", UserRoute);


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
