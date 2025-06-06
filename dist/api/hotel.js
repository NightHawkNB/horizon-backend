"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotel_1 = require("./../application/hotel");
const authentication_middleware_1 = require("./middlewares/authentication-middleware");
const authorization_middleware_1 = require("./middlewares/authorization-middleware");
const embeddings_1 = require("../application/embeddings");
const retrieve_1 = require("../application/retrieve");
const hotelsRouter = express_1.default.Router();
hotelsRouter.route("/").get(hotel_1.getAllHotels).post(authentication_middleware_1.isAuthenticated, authorization_middleware_1.isAdmin, hotel_1.createHotel);
hotelsRouter
    .route("/:id")
    .get(hotel_1.getHotelById)
    .put(hotel_1.updateHotel)
    .delete(hotel_1.deleteHotel);
hotelsRouter.route("/embeddings/create").post(embeddings_1.createEmbeddings);
hotelsRouter.route("/search/retrieve").get(retrieve_1.retrieve);
exports.default = hotelsRouter;
