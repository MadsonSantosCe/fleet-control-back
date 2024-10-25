import express, { urlencoded } from "express";
import truckRoutes from './routers/truckRoutes';
import cors from "cors";
import helmet from "helmet";

const server = express();
server.use(helmet());
server.use(cors());
server.use(urlencoded({ extended: true }));
server.use(express.json());

//routes
server.use('/api', truckRoutes);

//connection db


server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on ${process.env.BASE_URL}`);
});