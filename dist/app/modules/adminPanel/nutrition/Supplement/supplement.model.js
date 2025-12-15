"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplementItemModel = void 0;
const mongoose_1 = require("mongoose");
const SupplementItemSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    time: { type: String, required: true },
    purpose: { type: String, required: true },
    note: { type: String },
}, { timestamps: true });
exports.SupplementItemModel = (0, mongoose_1.model)('SupplementItem', SupplementItemSchema);
