"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.humanReadableFormate = exports.getNextCheckInDateFormatted = void 0;
const DAY_MAP = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
};
const getNextCheckInDateFormatted = (checkInDay, today = new Date()) => {
    const targetDay = DAY_MAP[checkInDay.toLowerCase()];
    if (targetDay === undefined) {
        throw new Error('Invalid check-in day');
    }
    const todayDay = today.getDay();
    let diff = targetDay - todayDay;
    if (diff < 0) {
        diff += 7;
    }
    const checkInDate = new Date(today);
    checkInDate.setDate(today.getDate() + diff);
    return checkInDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};
exports.getNextCheckInDateFormatted = getNextCheckInDateFormatted;
const humanReadableFormate = (date) => {
    if (!date)
        return null;
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};
exports.humanReadableFormate = humanReadableFormate;
