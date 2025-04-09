"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHotelDTO = void 0;
const zod_1 = require("zod");
// DTO => Domain Transfer Object
exports.CreateHotelDTO = zod_1.z.object({
    name: zod_1.z.string(),
    location: zod_1.z.string(),
    image: zod_1.z.string(),
    price: zod_1.z.number(),
    amenities: zod_1.z.array(zod_1.z.string()),
    description: zod_1.z.string()
});
