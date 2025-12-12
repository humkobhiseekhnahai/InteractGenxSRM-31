import express from "express";
import cors from "cors";
import conceptRouter from "./routes/concept.routes.js";
import blogRouter from "./routes/blog.routes.js";
import { search } from "./controllers/search.controller.js";
import graphRouter from "./routes/graph.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/concepts", conceptRouter);
app.use("/blogs", blogRouter);
app.use("/search", search);
app.use("/graph", graphRouter);
export default app;
//# sourceMappingURL=app.js.map