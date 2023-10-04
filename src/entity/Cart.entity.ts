import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';

@Entity()

export class Cart {
   @ObjectIdColumn()
  _id: ObjectId;

 @Column('text')
  user_id?: ObjectId;

  @Column('text')
  product_id?: ObjectId;
  
  @Column()
  amount : number;

  @Column()
  createdAt: Date; 

  @Column()
  updatedAt: Date; 


   constructor(data: Partial<Cart>){
        Object.assign(this,data)
    }
}