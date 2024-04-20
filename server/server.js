import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import expressRequestId from "express-request-id";
// configure .env using package dotenv
dotenv.config({ path: "./.env" });
import { dbConnect } from "./db.connect.js";
import { setRoutes } from "./routes.js";
import { invalidRouteHandler } from "./middleware/invalid.route.js";
import { errorHandler } from "./middleware/error.handler.js";
import { signAccessToken } from "./middleware/verify.access.token.js";
import { logIncomingRequest } from "./middleware/log.incoming.request.js";
import { logger } from "./logger.js";
import { cronSetup } from "./cron.setup.js";

dbConnect();

const app = new express();

cronSetup();

app.use(cors());

app.set("view engine", "ejs");

app.use(express.json());

app.use(expressRequestId());

app.use(logIncomingRequest);

app.use(signAccessToken);

setRoutes(app);

app.all("*", invalidRouteHandler);

app.use(errorHandler);

const port = process.env.EXPRESS_HTTP_SERVER_PORT || 8080;
app.listen(port, async (error) => {
    if (!error) {
        logger.info(`App is running at port: ${port}`);
    }
});

export default app;
