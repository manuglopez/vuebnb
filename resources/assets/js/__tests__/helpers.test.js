import { describe, it, expect } from 'vitest';
import { populateAmenitiesAndPrices, groupByCountry } from '../helpers';

// Estado real tal y como lo devuelve la API (/api/listing/3, fila 3 de database/data.json):
// amenities booleanos, precios como string e image_* con la URL de asset().
const realListing = {
    id: 3,
    title: "2 Bedroom House ' Pool Included!",
    address: 'No. 51, Hanzhong Street, Wanhua District, Taipei City, Taiwan 108',
    about: 'Come and stay at my home that has two bedrooms and bathrooms.',
    amenity_wifi: true,
    amenity_pets_allowed: true,
    amenity_tv: true,
    amenity_kitchen: true,
    amenity_breakfast: true,
    amenity_laptop: true,
    price_per_night: '$84',
    price_extra_people: '$22',
    price_weekly_discount: '7%',
    price_monthly_discount: '8%',
    image_1: 'http://localhost/images/3/Image_1.jpg',
    image_2: 'http://localhost/images/3/Image_2.jpg',
    image_3: 'http://localhost/images/3/Image_3.jpg',
    image_4: 'http://localhost/images/3/Image_4.jpg',
};

describe('Helpers', () => {
    describe('populateAmenitiesAndPrices', () => {
        it('con un estado real salen amenity_*, price_* e image_*', () => {
            const result = populateAmenitiesAndPrices(realListing);

            expect(result.id).toBe(3);
            expect(result.title).toBe(realListing.title);
            expect(result.address).toBe(realListing.address);
            expect(result.about).toBe(realListing.about);

            // Las seis amenidades mapeadas a su {title, icon}.
            expect(result.amenities).toEqual([
                { title: 'Wireless Internet', icon: 'fa-wifi' },
                { title: 'Pets Allowed', icon: 'fa-paw' },
                { title: 'TV', icon: 'fa-television' },
                { title: 'Kitchen', icon: 'fa-cutlery' },
                { title: 'Breakfast', icon: 'fa-coffee' },
                { title: 'Laptop friendly workspace', icon: 'fa-laptop' },
            ]);

            // Los cuatro precios con su título legible y el valor original.
            expect(result.prices).toEqual([
                { title: 'Per night', value: '$84' },
                { title: 'Extra people', value: '$22' },
                { title: 'Weekly discount', value: '7%' },
                { title: 'Monthly discount', value: '8%' },
            ]);

            // Las cuatro imágenes en orden.
            expect(result.images).toEqual([
                'http://localhost/images/3/Image_1.jpg',
                'http://localhost/images/3/Image_2.jpg',
                'http://localhost/images/3/Image_3.jpg',
                'http://localhost/images/3/Image_4.jpg',
            ]);
        });

        it('devuelve {} para un estado nulo o indefinido', () => {
            expect(populateAmenitiesAndPrices(null)).toEqual({});
            expect(populateAmenitiesAndPrices(undefined)).toEqual({});
        });

        it('devuelve arrays vacíos cuando no hay amenidades, precios ni imágenes', () => {
            const result = populateAmenitiesAndPrices({ id: 1, title: 'X', address: 'Y', about: 'Z' });
            expect(result.amenities).toEqual([]);
            expect(result.prices).toEqual([]);
            expect(result.images).toEqual([]);
        });
    });

    describe('groupByCountry', () => {
        it('agrupa los listings por país (Taiwan, Polonia, Cuba)', () => {
            const listings = [
                { address: 'Taiwan, Taipei' },
                { address: 'Poland, Warsaw' },
                { address: 'Cuba, Havana' },
                { address: 'USA, New York' },
                { address: 'Taiwan, Taichung' },
            ];
            const result = groupByCountry(listings);

            expect(result.Taiwan).toHaveLength(2);
            expect(result.Poland).toHaveLength(1);
            expect(result.Cuba).toHaveLength(1);
            expect(result.Taiwan.map(l => l.address)).toContain('Taiwan, Taipei');
            expect(result.Taiwan.map(l => l.address)).toContain('Taiwan, Taichung');
        });

        it('devuelve {} para entrada vacía o nula', () => {
            expect(groupByCountry([])).toEqual({});
            expect(groupByCountry(null)).toEqual({});
            expect(groupByCountry(undefined)).toEqual({});
        });
    });
});