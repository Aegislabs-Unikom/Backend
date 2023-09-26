import { Entity, ObjectIdColumn, Column,  ObjectId } from "typeorm";

@Entity()
export class Product {

    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    nama_produk: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column('text')
    image?: string;

    @Column('text')
    user_id?: ObjectId;

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