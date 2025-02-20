import { check } from 'express-validator';

export const eventValidator = [
  check('message')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('message is required')
    .isString()
    .withMessage('message must be a string'),
  check('channel_id')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('channel_id is required')
    .isString()
    .withMessage('channel_id must be a string'),
];
