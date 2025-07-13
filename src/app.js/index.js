import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import { setupSwagger } from "../docs/swagger.doc.js";
import { initDB } from "../db/init.js";
import routeProducts from "../routes/product.route.js";
import routeUsers from "../routes/user.route.js";
import routeSales from "../routes/sale.route.js";
import routeTypes from "../routes/type.route.js";
import routePresentations from "../routes/presentation.route.js";
import routeOrigins from "../routes/origin.route.js";
import routeSupply from "../routes/supply.route.js";
import routeSupplyEntries from "../routes/supply_entry.route.js";
import routeSupplyConsumption from "../routes/supply_consumption.route.js";

process.loadEnvFile();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

setupSwagger(app);
app.use(routeProducts);
app.use(routeUsers);
app.use(routeSales);
app.use(routeTypes);
app.use(routePresentations);
app.use(routeOrigins);
app.use(routeSupply);
app.use(routeSupplyEntries);
app.use(routeSupplyConsumption);

app.listen(PORT, () => {
  console.log(`Server starting in http://localhost:${PORT}`);
});

initDB().catch(console.error);
