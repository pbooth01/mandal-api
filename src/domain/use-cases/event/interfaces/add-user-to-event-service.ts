import { EventModel } from "../../../models/event";

export interface IAddUserToEventService {
  execute: (eventId: string, sessionUserId: string) => Promise<void>
}