"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHotel = exports.deleteHotel = exports.createHotel = exports.generateResponse = exports.getHotelById = exports.getAllHotels = void 0;
const Hotel_1 = __importDefault(require("../infrastructure/schemas/Hotel"));
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const hotel_1 = require("../domain/dtos/hotel");
const openai_1 = __importDefault(require("openai"));
const mongoose_1 = __importDefault(require("mongoose"));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getAllHotels = async (req, res, next) => {
    try {
        const hotels = await Hotel_1.default.find();
        res.status(200).json(hotels);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getAllHotels = getAllHotels;
const getHotelById = async (req, res, next) => {
    try {
        const hotelId = req.params.id;
        const hotel = await Hotel_1.default.findById(new mongoose_1.default.Types.ObjectId(hotelId));
        if (!mongoose_1.default.Types.ObjectId.isValid(hotelId)) {
            throw new Error("Invalid ObjectId format");
        }
        if (!hotel) {
            throw new not_found_error_1.default("Hotel not found");
        }
        res.status(200).json(hotel);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getHotelById = getHotelById;
const generateResponse = async (req, res, next) => {
    const { prompt } = req.body;
    const openai = new openai_1.default({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            // {
            //   role: "system",
            //   content:
            //     "You are assistant that will categorize the words that a user gives and give them labels and show an output. Return this response as in the following examples: user: Lake, Cat, Dog, Tree; response: [{label:Nature, words:['Lake', 'Tree']}, {label:Animals, words:['Cat', 'Dog']}] ",
            // },
            { role: "user", content: prompt },
        ],
        store: true,
    });
    res.status(200).json({
        message: {
            role: "assistant",
            content: completion.choices[0].message.content,
        },
    });
    return;
};
exports.generateResponse = generateResponse;
const createHotel = async (req, res, next) => {
    try {
        const hotel = hotel_1.CreateHotelDTO.safeParse(req.body);
        // Validate the request data
        if (!hotel.success) {
            throw new validation_error_1.default(hotel.error.message);
        }
        // Add the hotel
        await Hotel_1.default.create({
            name: hotel.data.name,
            location: hotel.data.location,
            image: hotel.data.image,
            price: hotel.data.price,
            amenities: hotel.data.amenities,
            description: hotel.data.description,
        });
        // Return the response
        res.status(201).send();
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.createHotel = createHotel;
const deleteHotel = async (req, res, next) => {
    try {
        const hotelId = req.params.id;
        await Hotel_1.default.findByIdAndDelete(hotelId);
        // Return the response
        res.status(200).send();
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.deleteHotel = deleteHotel;
const updateHotel = async (req, res, next) => {
    try {
        const hotelId = req.params.hotelId;
        const updatedHotel = req.body;
        // Validate the request data
        if (!updatedHotel.name ||
            !updatedHotel.location ||
            !updatedHotel.rating ||
            !updatedHotel.reviews ||
            !updatedHotel.image ||
            !updatedHotel.price ||
            !updatedHotel.description) {
            throw new validation_error_1.default("Invalid hotel data");
        }
        await Hotel_1.default.findByIdAndUpdate(hotelId, updatedHotel);
        // Return the response
        res.status(200).send();
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.updateHotel = updateHotel;
