"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./infrastructure/db"));
const express_2 = require("@clerk/express");
const cors_1 = __importDefault(require("cors"));
const booking_1 = __importDefault(require("./api/booking"));
const hotel_1 = __importDefault(require("./api/hotel"));
const global_error_handling_middleware_1 = __importDefault(require("./api/middlewares/global-error-handling-middleware"));
const app = (0, express_1.default)();
app.use((0, express_2.clerkMiddleware)());
//* Middleware to parse JSON data in the request body
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "https://aidf-horizone-frontend-nipunbathiya.netlify.app" }));
(0, db_1.default)();
app.use("/api/hotels", hotel_1.default);
app.use("/api/bookings", booking_1.default);
app.use(global_error_handling_middleware_1.default);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
