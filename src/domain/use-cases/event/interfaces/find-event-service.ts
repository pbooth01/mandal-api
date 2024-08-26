import { EventModel } from "../../../models/event";

export interface IFindEventService {
  execute: (eventId: string, userId: string) => Promise<EventModel | null>
}