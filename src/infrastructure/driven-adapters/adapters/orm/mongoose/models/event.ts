import { Types } from "mongoose";

export type EventModel = {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    chainable: boolean;
    chainCount: number;
    createdBy: Types.ObjectId;
    joinedBy: Types.ObjectId[];
    parentEvent?: Types.ObjectId;
    event_location?: {
        name: string,
        lat: number,
        lon: number
    }
}