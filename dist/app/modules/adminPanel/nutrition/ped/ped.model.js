"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PEDInfoModel = void 0;
const mongoose_1 = require("mongoose");
const DosageInfoSchema = new mongoose_1.Schema({
    dosage: { type: String },
    frequency: { type: String },
    mon: { type: String },
    tue: { type: String },
    wed: { type: String },
    thu: { type: String },
    fri: { type: String },
    sat: { type: String },
    sun: { type: String },
}, { _id: false });
const PEDInfoSchema = new mongoose_1.Schema({
    week: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    ped: { type: DosageInfoSchema, required: true },
}, {
    timestamps: true,
});
exports.PEDInfoModel = (0, mongoose_1.model)('PEDInfo', PEDInfoSchema);
