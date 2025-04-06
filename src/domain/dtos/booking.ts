import { z } from "zod";

export const CreateBookingDTO = z.object({
    // userid: z.string(),
    hotelId: z.string(),
    checkIn: z.string(),
    checkOut: z.string(),
    roomNumber: z.number().optional(),
    totalPrice: z.number(),
    guests: z.number(),
})