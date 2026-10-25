<?php

namespace Tests\Feature;

use Tests\FeatureTestCase;

pest:
    uses(FeatureTestCase::class)->in('Feature');

class WebRouteTest extends FeatureTestCase
{
    /**
     * Test the home route returns a successful response.
     */
    public function test_home_route_returns_successful_response(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertViewIs('app');
        $response->assertViewHas('data');
    }

    /**
     * Test the saved route returns a successful response.
     */
    public function test_saved_route_returns_successful_response(): void
    {
        $response = $this->get('/saved');
        $response->assertStatus(200);
        $response->assertViewIs('app');
        $response->assertViewHas('data');
    }

    /**
     * Test the listing route returns a successful response for an existing listing.
     */
    public function test_listing_route_returns_successful_response(): void
    {
        $listing = \App\Listing::first();
        $response = $this->get('/listing/' . $listing->id);
        $response->assertStatus(200);
        $response->assertViewIs('app');
        $response->assertViewHas('data');
    }

    /**
     * Test the listing route returns 404 for a non-existent listing.
     */
    public function test_listing_route_returns_404_for_nonexistent_listing(): void
    {
        $response = $this->get('/listing/99999');
        $response->assertStatus(404);
    }
}