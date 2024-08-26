import { EventModel } from "../../../models/event";
import { FindEventForUserFilter } from "../../../types/find-events-for-user-filter";

export interface IFindEventsForUserService {
  execute: (sessionUserId: string, userId: string, filterType: FindEventForUserFilter) => Promise<EventModel[]>
}