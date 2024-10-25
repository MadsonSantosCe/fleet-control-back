-- CreateTable
CREATE TABLE "Truck" (
    "id" SERIAL NOT NULL,
    "licensePlate" TEXT NOT NULL,

    CONSTRAINT "Truck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "license" TEXT NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "destination" TEXT NOT NULL,
    "deliveryTime" TIMESTAMP(3) NOT NULL,
    "truckId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "insurance" BOOLEAN NOT NULL,
    "dangerous" BOOLEAN NOT NULL,
    "valuable" BOOLEAN NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Truck_licensePlate_key" ON "Truck"("licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_license_key" ON "Driver"("license");

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
