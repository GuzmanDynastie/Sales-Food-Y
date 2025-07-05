import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import { setupSwagger } from "../docs/swagger.doc.js";
import { initDB } from "../db/init.js";
import routeProduct from "../routes/product.route.js";
import routeUser from "../routes/user.route.js";

process.loadEnvFile();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

setupSwagger(app);
app.use(routeProduct);
app.use(routeUser);

app.listen(PORT, () => {
  console.log(`Server starting in http://localhost:${PORT}`);
});

initDB().catch(console.error);
