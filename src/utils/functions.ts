import { DeliveryInput } from "../interfaces/delivery";

export const applyDefaultBooleanValues = (input: DeliveryInput) => ({
    ...input,
    insurance: input.insurance ?? false,
    dangerous: input.dangerous ?? false,
    valuable: input.valuable ?? false,
  });