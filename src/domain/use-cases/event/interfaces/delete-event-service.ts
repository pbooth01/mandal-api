export interface IDeleteEventService {
  execute: (eventId: string, userId: string) => Promise<void>
}