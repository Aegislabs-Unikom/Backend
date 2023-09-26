import { Entity, ObjectIdColumn, Column,  ObjectId } from "typeorm";


@Entity()
export class OTP {

    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    otp: string;

    @Column('text')
    user_id?: ObjectId; 

    @Column()
    expiresAt?: Date;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

  
    

    constructor(data: Partial<OTP>){
        Object.assign(this,data)
    }
}
