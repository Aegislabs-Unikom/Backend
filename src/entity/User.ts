import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm"

@Entity()
export class User {

    @ObjectIdColumn()
    _id: ObjectId
    
    @Column()
    email: string;

    @Column()
    nama: string;

    @Column()
    password: string;

    @Column()
    role: string;

    @Column()
    is_verified: boolean;

    @Column('text')
    refresh_token?: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;


    constructor(data: Partial<User>){
        Object.assign(this,data)
    }

}
