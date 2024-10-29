import { Hono } from 'hono';
import { HonoEnv } from '../../../types/hono-env';
import { search } from '../../http/controllers/events/search';
import { create } from '../../http/controllers/events/create';
import { total } from '../../http/controllers/events/total-events';
import { updateAmountView } from '../../http/controllers/events/update-amount-view';
import { updateAmountInscription } from '../../http/controllers/events/update-amount-inscription';
import { deleteEvent } from '../../http/controllers/events/delete';
import { searchBanners } from '../../http/controllers/events/search-banners';

export const eventsRoutes = new Hono<HonoEnv>();

eventsRoutes.post('/events', create);
eventsRoutes.get('/events', search);
eventsRoutes.get('/events/total', total);
eventsRoutes.get('/events/banner', searchBanners);
eventsRoutes.put('/events/:id/update/amount-view', updateAmountView);
eventsRoutes.put('/events/:provider/:external_id/update/amount-inscription', updateAmountInscription);
eventsRoutes.delete('/events/:external_id/delete', deleteEvent);