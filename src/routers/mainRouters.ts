import { Router } from 'express';
const truckController = require("../controllers/truck");
const driverController = require("../controllers/driver");

const router = Router();

router.post('/truck', truckController.createTruck);
router.get('/trucks', truckController.getTrucks);
router.get('/truck/:id', truckController.getTruckById);
router.put('/truck/:id', truckController.updateTruck);
router.delete('/truck/:id', truckController.deleteTruck);

router.post('/driver', driverController.createDriver);
router.get('/drivers', driverController.getDrivers);
router.get('/driver/:id', driverController.getDriverById);
router.put('/driver/:id', driverController.updateDriver);
router.delete('/driver/:id', driverController.deleteDriver);

export default router;