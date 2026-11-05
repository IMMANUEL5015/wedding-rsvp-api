import express from 'express';
import type {Router, Request, Response} from 'express';
import { successResponse } from './helpers/responses';
import statusCodes from './helpers/statusCodes';
import validate from './helpers/validate';
import protect from './helpers/protect';
import { reserveSeatValidation } from './modules/rsvp/validations';
import { reserveSeatController, getGuestListController } from './modules/rsvp/controllers';

const router: Router = express.Router();

// Public: reserve seats for a guest and their companions.
router.post('/rsvp', validate(reserveSeatValidation()), reserveSeatController);

// Restricted: requires the `api-access-key` header.
router.get('/rsvp', protect, getGuestListController);

router.get('/health', (req: Request, res: Response) => {
    return successResponse(req, res, {
        message: 'API is active and running smoothly!',
        statusCode: statusCodes.ok
    });
});

export default router;
