export type DeliveryInput = {
  type: string;
  value: number;
  destination: string;
  deliveryTime: Date;
  truckId: number;
  driverId: number;
  insurance?: boolean;
  dangerous?: boolean;
  valuable?: boolean;
};