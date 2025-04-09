"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookingDTO = void 0;
const zod_1 = require("zod");
exports.CreateBookingDTO = zod_1.z.object({
    // userid: z.string(),
    hotelId: zod_1.z.string(),
    checkIn: zod_1.z.string(),
    checkOut: zod_1.z.string(),
    roomNumber: zod_1.z.number().optional(),
    totalPrice: zod_1.z.number(),
    guests: zod_1.z.number(),
});
