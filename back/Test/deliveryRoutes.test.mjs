import request from 'supertest';
import express from 'express';
import Delivery from '../src/models/Delivery.mjs';
import deliveryRoutes from '../src/routes/deliveryRoutes.mjs';
import { shouldBeAuthenticate } from '../src/middlewares/authentication.mjs';
//import { save } from 'pdfkit';

const app = express();
app.use(express.json());
app.use(deliveryRoutes);


jest.mock('../src/middlewares/authentication.mjs', () => ({
    shouldBeAuthenticate: (req, res, next) => next(),
}));


const mockSave = jest.fn();
const mockFind = jest.fn();
const mockFindById = jest.fn();

jest.mock('../src/models/Delivery.mjs', () => {
    return jest.fn().mockImplementation(() => {
        return {
            save: mockSave,
        };
    });
});

Delivery.find = mockFind;
Delivery.findById = mockFindById;


describe('Delivery Routes', () => {
    test('POST /deliveries - Success', async () => {
        const deliveryData = {
            id: '12345',
            address: '123 Test Street',
            status: 'Pending',
            following_number: '1234567890',
            delivered: false,
        };


        // Simuler la méthode `save`
        mockSave.mockResolvedValue(deliveryData);

        const response = await request(app)
            .post('/deliveries')
            .send(deliveryData);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(deliveryData);
    });

    test('GET /deliveries - Success', async () => {
        const deliveries = [
            { id: '12345', address: '123 Test Street', status: 'Pending', following_number: '1234567890', delivered: false },
            { id: '67890', address: '456 Another St', status: 'Delivered', following_number: '0987654321', delivered: true },
        ];

        // Simuler la méthode `find`
        mockFind.mockResolvedValue(deliveries);

        const response = await request(app).get('/deliveries');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(deliveries);
    });

    test('PATCH /deliveries/:id - Success', async () => {
        const updatedDelivery = {
            id: '12345',
            address: '123 Test Street',
            status: 'Livré',
            following_number: '1234567890',
            delivered: true,
        };

        // Simuler la méthode `findById`
        mockFindById.mockResolvedValue({
            ...updatedDelivery,
            save: jest.fn().mockResolvedValue(updatedDelivery),
        });

        const response = await request(app)
            .patch('/deliveries/12345')
            .send({ delivered: true });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedDelivery);
    });

    test('PATCH /deliveries/:id - Failure due to invalid updates', async () => {
        const response = await request(app)
            .patch('/deliveries/12345')
            .send({ invalidField: 'some value' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid updates!');
    });
});