import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
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
import routeRecipes from "../routes/recipe.route.js";

// process.loadEnvFile();
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use(cors());

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
app.use(routeRecipes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server starting in http://localhost:${PORT}`);
});

initDB().catch(console.error);
