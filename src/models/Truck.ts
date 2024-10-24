import { Model } from 'sequelize';

class Truck extends Model {
  public id!: number;
  public licensePlate!: string;
}

export default Truck;