
import { Exclude, Expose, Type } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";
import { id, Model } from "@envuso/core/Database";
import { ObjectId } from "mongodb";

export class List extends Model<List> {

    @id
    _id : ObjectId;
    title: string;
    createdAt: Date;

}
