import { productDocs } from "../products/product.doc.route.js";
import { userDocs } from "../users/user.doc.route.js";
import { saleDocs } from "../sales/sale.doc.route.js";
import { typeDocs } from "../types/type.doc.route.js";
import { presentationDocs } from "../presentations/presentation.doc.route.js";
import { originDocs } from "../origins/origin.doc.route.js";
import { supplyDocs } from "../supplies/supply.doc.route.js";
import { supplyEntryDocs } from "../supply_entries/supply_entries.doc.route.js";
import { supplyConsumptionsDocs } from "../supply_consumptions/supply_consumptions.doc.route.js";
import { recipeDocs } from "../recipes/recipe.doc.route.js";

export const swaggerDefinition = {
  openapi: "3.1.1",
  info: {
    title: "Sistema de Gestion de Productos y Usuarios - API REST",
    version: "1.0.2",
    description:
      "Esta documentacion detalla los endpoints disponibles para gestionar productos, usuarios y sus operaciones relacionadas. Incluye operaciones CRUD, filtros y validaciones.",
      contact: {
        name: "Emmanuel Guzman",
        email: "guzmanjrpro@gmail.com",
      }
      
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Servidor local de desarrollo",
    },
  ],
  paths: {
    ...productDocs,
    ...userDocs,
    ...saleDocs,
    ...typeDocs,
    ...presentationDocs,
    ...originDocs,
    ...supplyDocs,
    ...supplyEntryDocs,
    ...supplyConsumptionsDocs,
    ...recipeDocs,
  },
};
