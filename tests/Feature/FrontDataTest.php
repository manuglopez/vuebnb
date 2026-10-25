<?php

namespace Tests\Feature;

use Illuminate\Support\Collection;
use Tests\FeatureTestCase;

/**
 * Datos que consume el front (server_data de la web y JSON de la API).
 *
 * AC-FRONT-1 / El server_data de / lleva thumb y price_per_night en cada listing.
 * AC-FRONT-2 / /api/listing/{id} responde 200 con las amenidades (amenity_*).
 */
class FrontDataTest extends FeatureTestCase
{
    public function test_home_server_data_includes_thumb_and_price_per_night(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);

        $data = $response->viewData('data');
        expect($data)->toBeInstanceOf(Collection::class);

        $listings = $data->get('listings');
        expect($listings)->toBeArray();
        expect(count($listings))->toBeGreaterThan(0);

        foreach ($listings as $listing) {
            expect($listing)->toHaveKeys(['id', 'address', 'title', 'price_per_night', 'thumb']);
        }

        $first = $listings[0];
        expect($first['thumb'])->toContain('/images/'.$first['id'].'/Image_1_thumb.jpg');
        expect($first['price_per_night'])->not->toBeEmpty();
    }

    public function test_api_listing_returns_200_with_amenities(): void
    {
        $response = $this->getJson('/api/listing/1');
        $response->assertStatus(200);

        $listing = $response->json('listing');
        expect($listing)->toBeArray();
        expect($listing['id'])->toBe(1);
        expect($listing)->toHaveKeys([
            'amenity_wifi',
            'amenity_pets_allowed',
            'amenity_tv',
            'amenity_kitchen',
            'amenity_breakfast',
            'amenity_laptop',
        ]);

        // La ficha necesita también precios e imágenes.
        expect($listing)->toHaveKey('price_per_night');
        expect($listing['image_1'])->toContain('/images/1/Image_1.jpg');
    }
}
