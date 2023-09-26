import { Entity,ObjectIdColumn, Column,  ObjectId} from "typeorm";

@Entity()
export class Category {

  @ObjectIdColumn()
  _id : ObjectId;

  @Column()
  nama_category : string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
      constructor(data: Partial<Category>){
        Object.assign(this,data)
    }
}