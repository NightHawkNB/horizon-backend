import { isAuthenticated } from './middlewares/authentication-middleware';
import express from "express";
import {
  createBooking,
  getAllBookingsForHotel,
  getAllBookings,
  getAllBookingsForUser,
} from "../application/booking";

const bookingsRouter = express.Router();

bookingsRouter.route("/").post(isAuthenticated, createBooking).get(isAuthenticated, getAllBookings);
bookingsRouter.route("/hotels/:hotelId").get(isAuthenticated, getAllBookingsForHotel);
bookingsRouter.route("/user").get(isAuthenticated, getAllBookingsForUser);

export default bookingsRouter;
