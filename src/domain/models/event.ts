import { UserModel } from "./user";

export type EventModel = {
    _id: string;
    name: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    chainable: boolean;
    chainCount: number;
    createdBy: UserModel;
    joinedBy: UserModel[];
    parentEvent?: EventModel;
    event_location?: {
        name: string,
        lat: number,
        lon: number
    }
}