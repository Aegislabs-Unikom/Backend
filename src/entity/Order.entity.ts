import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';
import { Product } from './Product.entity';

@Entity()
export class Order {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column((type) => Product)
  products :Product[];

  @Column()
  status: string; 

  @Column()
  total_amount: number; 

  @Column('text')
  user_id?: ObjectId;

  @Column()
  createdAt: Date; 

  @Column()
  updatedAt: Date; 


    constructor(data: Partial<Order>){
        Object.assign(this,data)
    }
}
