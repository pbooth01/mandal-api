import { Schema } from "mongoose";
import { EventModel } from "../models/event";

const EventModelSchema = new Schema<EventModel>({
    createdBy: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        index: true
    },
    joinedBy: {
        type: [{ type : Schema.Types.ObjectId, ref: 'User' }],
    },
    parentEvent: {
        type: Schema.Types.ObjectId, 
        ref: 'Event',
        index: true
    },
    name: { 
        type: String, 
        required: true 
    },
    description: {
        type: String,
        maxlength: 300
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    chainable: {
        type: Boolean,
        required: true,
        default: true,
    },
    chainCount: {
        type: Number,
        required: true,
        default: 0,
    },
    event_location:  { 
        name: {
            type: String
        },
        lat: {
            type: Number
        },
        lon: {
            type: Number
        }
    }
},{timestamps: true});

EventModelSchema.index({createdBy: 1, updatedAt: -1, startTime: -1});

// EventModelSchema.set('toObject', {
//     transform: (doc, ret, options) => {
//         if (options.hide) {
//             options.hide.split(' ').forEach(function (prop: string) {
//               delete ret[prop];
//             });
//           }
//           return ret;
//     }
// });

export default EventModelSchema;