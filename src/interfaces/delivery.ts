import { DeliveryType, Destinations } from "@prisma/client";


export type DeliveryInput = {
  type: DeliveryType;
  value: number;
  destination: Destinations;
  deliveryTime: Date;
  truckId: number;
  driverId: number;
  insurance?: boolean;
  dangerous?: boolean;
  valuable?: boolean;
};