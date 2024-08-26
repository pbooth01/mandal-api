import mongoose from "mongoose";
import { EventModel } from "./event";

export type CreateEventRequestModel = Omit<EventModel, 
    '_id' | 'joinedBy' | 'startTime' | 'endTime' | 'chainCount' | 'parentEvent'> & { 
    createdBy: string,
    startTime: Date,
    endTime: Date
};
