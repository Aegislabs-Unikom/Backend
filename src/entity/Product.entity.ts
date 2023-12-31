import { Entity, ObjectIdColumn, Column,  ObjectId } from "typeorm";

@Entity()
export class Product {

    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    nama_produk: string;

    @Column()
    description: string;

    @Column('int')
    price: number;

    @Column('text')
    image?: any;

    @Column('text')
    user_id?: ObjectId;

    @Column('text')
    category_id?: ObjectId;

    @Column()
    stock: number;

     @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;


    constructor(data: Partial<Product>) {
        Object.assign(this, data);
    }
}
