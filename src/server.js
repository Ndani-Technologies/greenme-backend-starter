import app from "./app";
import env from "./configs/dev";
import logger from "./middleware/logger";

const { host, port } = env;

app.listen(port, logger.info(`🚀 listening to requests on ${host}:${port}`));
