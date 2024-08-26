import express from 'express'
import { EventController } from '../controllers/event-controller';


export default function EventRouter(
    eventController: EventController
) {
    const router = express.Router()
    router.route('/')
        .post([eventController.createEvent.bind(eventController)]);
    return router
}