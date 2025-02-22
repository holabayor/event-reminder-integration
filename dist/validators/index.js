"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventValidator = void 0;
const express_validator_1 = require("express-validator");
exports.eventValidator = [
    (0, express_validator_1.check)('message')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('message is required')
        .isString()
        .withMessage('message must be a string'),
    (0, express_validator_1.check)('channel_id')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('channel_id is required')
        .isString()
        .withMessage('channel_id must be a string'),
];
