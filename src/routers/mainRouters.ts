import { Router } from 'express';
const truckController = require("../controllers/TruckController");
const driverController = require("../controllers/DriverController");
const deliveryController = require("../controllers/DeliveryController");

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

router.post('/delivery', deliveryController.createDelivery);
router.get('/deliveries', deliveryController.getDeliveries);
router.get('/delivery/:id', deliveryController.getDeliveryById);
router.put('/delivery/:id', deliveryController.updateDelivery);
router.delete('/delivery/:id', deliveryController.deleteDelivery);

export default router;