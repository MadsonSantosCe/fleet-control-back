import { DeliveryType, Destinations } from "@prisma/client";
import { DeliveryInput } from "../interfaces/delivery";

export const applyDeliveryRulesValues = (input: DeliveryInput) => {
  const delivery = {
    ...input,
    insurance: input.insurance ?? false,
    dangerous: input.dangerous ?? false,
    valuable: input.valuable ?? false,
  };

  if((input.value > 30000)){
    delivery.valuable = true;
  }
  
  if (DeliveryType.Combustivel) {
    delivery.dangerous = true;
  }
  
  switch (delivery.destination) {
    case Destinations.Nordeste:
      delivery.value *= 1.2; 
      break;
    case Destinations.Argentina:
      delivery.value *= 1.4; 
      break;
    case Destinations.Amazonia:
      delivery.value *= 1.3; 
      break;
    default:
      break;
  }

  return delivery;
};