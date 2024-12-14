import express, { urlencoded } from "express";
import mainRoutes from './routers/mainRouters';
import cors from "cors";
import helmet from "helmet";

const app = express();
app.use(helmet());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(express.json());

//routes
app.use('/api', mainRoutes);

export default app;