"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookingsForUser = exports.getAllBookings = exports.getAllBookingsForHotel = exports.createBooking = void 0;
const Booking_1 = __importDefault(require("../infrastructure/schemas/Booking"));
const booking_1 = require("../domain/dtos/booking");
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const express_1 = require("@clerk/express");
const createBooking = async (req, res, next) => {
    try {
        const booking = booking_1.CreateBookingDTO.safeParse(req.body);
        console.log(booking);
        if (!booking.success) {
            throw new validation_error_1.default(booking.error.message);
        }
        const user = req.auth;
        console.log(user);
        await Booking_1.default.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.createBooking = createBooking;
const getAllBookingsForHotel = async (req, res, next) => {
    try {
        const hotelId = req.params.hotelId;
        const bookings = await Booking_1.default.find({ hotelId: hotelId });
        const bookingsWithUser = await Promise.all(bookings.map(async (el) => {
            const user = await express_1.clerkClient.users.getUser(el.userId);
            return { _id: el._id, hotelId: el.hotelId, checkIn: el.checkIn, checkOut: el.checkOut, roomNumber: el.roomNumber, user: { id: user.id, firstName: user.firstName, lastName: user.lastName } };
        }));
        res.status(200).json(bookingsWithUser);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getAllBookingsForHotel = getAllBookingsForHotel;
const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking_1.default.find();
        res.status(200).json(bookings);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getAllBookings = getAllBookings;
const getAllBookingsForUser = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const bookings = await Booking_1.default.find({ userId });
        res.status(200).json(bookings);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getAllBookingsForUser = getAllBookingsForUser;
