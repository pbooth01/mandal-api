import { Model, Schema } from "mongoose";
import { UserModel } from "../models/user";
import { UserModel as UserDomainModel } from "../../../../../../domain/models/user";

export interface IUserMethods {
    userDomainModel(): UserDomainModel,
}

export interface IUserMongooseModel extends Model <
    UserModel,
    {},
    IUserMethods
>{}

const UserModelSchema = new Schema<UserModel, IUserMongooseModel>({
    name: { 
        type: String, 
        maxlength: 100,
        required: true
    },
    email:  { 
        type: String, 
        required: true, 
        index: true, 
        unique: true 
    }
},{timestamps: true});

UserModelSchema.method("userDomainModel", function(): UserDomainModel {
    return {
        _id: this._id.toString(),
        name: this.name,
        email: this.email,
    }
});

export default UserModelSchema;