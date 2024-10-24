import express, { urlencoded } from "express";
import truckRoutes from './routers/truckRoutes';
import cors from "cors";
import helmet from "helmet";
import sequelize from "./db/connection";

const server = express();
server.use(helmet());
server.use(cors());
server.use(urlencoded({extended: true}));
server.use(express.json());

//routes
server.use('/api', truckRoutes);

//connection db
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully.');    
    return sequelize.sync();
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

  server.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on ${process.env.BASE_URL}`);
  });