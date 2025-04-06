import { NextFunction, Request, Response } from "express";

import Booking from "../infrastructure/schemas/Booking";
import { CreateBookingDTO } from "../domain/dtos/booking";
import ValidationError from "../domain/errors/validation-error";
import { AuthObject, clerkClient } from "@clerk/express";

interface AuthenticatedRequest extends Request {
  auth: AuthObject;
}

export const createBooking = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = CreateBookingDTO.safeParse(req.body);
    console.log(booking);

    if (!booking.success) {
      throw new ValidationError(booking.error.message)
    }

    const user = req.auth;
    console.log(user)

    await Booking.create({
      hotelId: booking.data.hotelId,
      userId: user.userId,
      checkIn: booking.data.checkIn,
      checkOut: booking.data.checkOut,
      guests: booking.data.guests,
      totalPrice: booking.data.totalPrice,
      // roomNumber: booking.data.roomNumber,
    });

    res.status(201).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllBookingsForHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotelId = req.params.hotelId;
    const bookings = await Booking.find({ hotelId: hotelId });
    const bookingsWithUser = await Promise.all(bookings.map(async (el) => {
      const user = await clerkClient.users.getUser(el.userId);
      return { _id: el._id, hotelId: el.hotelId, checkIn: el.checkIn, checkOut: el.checkOut, roomNumber: el.roomNumber, user: { id: user.id, firstName: user.firstName, lastName: user.lastName } }
    }))

    res.status(200).json(bookingsWithUser);
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookings = await Booking.find();

    res.status(200).json(bookings);
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllBookingsForUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth.userId;
    const bookings = await Booking.find({ userId });

    res.status(200).json(bookings);
    return;
  } catch (error) {
    next(error);
  }
};
