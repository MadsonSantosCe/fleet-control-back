import { Router } from 'express';
const truckController = require("../controllers/truck");

const router = Router();

router.post('/truck', truckController.createTruck);
router.get('/trucks', truckController.getTrucks);
router.get('/truck/:id', truckController.getTruckById);
router.put('/truck/:id', truckController.updateTruck);
router.delete('/truck/:id', truckController.deleteTruck);

export default router;