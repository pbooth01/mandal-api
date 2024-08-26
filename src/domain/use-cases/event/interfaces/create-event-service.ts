import { CreateEventRequestModel } from "../../../models/createEventRequest";
import { EventModel } from "../../../models/event";

export interface ICreateEventService {
  execute: (event: CreateEventRequestModel) => Promise<EventModel>
}