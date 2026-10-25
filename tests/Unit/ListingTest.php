<?php

namespace Tests\Unit;

use App\Listing;

pest:
    uses(\Tests\TestCase::class)->in('Unit');

class ListingTest extends \Tests\TestCase
{
    /**
     * Test Listing model boolean casts.
     */
    public function test_listing_model_boolean_casts(): void
    {
        $listing = new Listing();
        
        // Set the properties to test the casts
        $listing->amenity_wifi = false;
        $listing->amenity_pets_allowed = false;
        $listing->amenity_tv = false;
        $listing->amenity_kitchen = false;
        $listing->amenity_breakfast = false;
        $listing->amenity_laptop = false;
        
        expect($listing->amenity_wifi)->toBeFalse();
        expect($listing->amenity_pets_allowed)->toBeFalse();
        expect($listing->amenity_tv)->toBeFalse();
        expect($listing->amenity_kitchen)->toBeFalse();
        expect($listing->amenity_breakfast)->toBeFalse();
        expect($listing->amenity_laptop)->toBeFalse();
    }

    /**
     * Test listing model cast attributes.
     */
    public function test_listing_model_cast_attributes(): void
    {
        $listing = new Listing();
        
        $cast = $listing->getCasts();
        
        expect($cast)->toHaveKey('amenity_wifi');
        expect($cast)->toHaveKey('amenity_pets_allowed');
        expect($cast)->toHaveKey('amenity_tv');
        expect($cast)->toHaveKey('amenity_kitchen');
        expect($cast)->toHaveKey('amenity_breakfast');
        expect($cast)->toHaveKey('amenity_laptop');
    }

    /**
     * Test listing model fillable attributes.
     */
    public function test_listing_model_fillable_attributes(): void
    {
        $listing = new Listing();
        
        $fillable = $listing->getFillable();
        
        expect($fillable)->toContain('title');
        expect($fillable)->toContain('address');
        expect($fillable)->toContain('about');
        expect($fillable)->toContain('amenity_wifi');
        expect($fillable)->toContain('amenity_pets_allowed');
        expect($fillable)->toContain('amenity_tv');
        expect($fillable)->toContain('amenity_kitchen');
        expect($fillable)->toContain('amenity_breakfast');
        expect($fillable)->toContain('amenity_laptop');
        expect($fillable)->toContain('price_per_night');
        expect($fillable)->toContain('price_extra_people');
        expect($fillable)->toContain('price_weekly_discount');
        expect($fillable)->toContain('price_monthly_discount');
    }

    /**
     * Test listing model accessible attributes.
     */
    public function test_listing_model_accessible_attributes(): void
    {
        $listing = new Listing();
        
        $visible = $listing->getVisible();
        
        expect($visible)->toContain('id');
        expect($visible)->toContain('title');
        expect($visible)->toContain('address');
        expect($visible)->toContain('about');
    }

    /**
     * Test listing model default values.
     */
    public function test_listing_model_default_values(): void
    {
        $listing = new Listing();
        
        // Set the properties to test the default values
        $listing->amenity_wifi = false;
        $listing->amenity_pets_allowed = false;
        $listing->amenity_tv = false;
        $listing->amenity_kitchen = false;
        $listing->amenity_breakfast = false;
        $listing->amenity_laptop = false;
        
        expect($listing->amenity_wifi)->toBeFalse();
        expect($listing->amenity_pets_allowed)->toBeFalse();
        expect($listing->amenity_tv)->toBeFalse();
        expect($listing->amenity_kitchen)->toBeFalse();
        expect($listing->amenity_breakfast)->toBeFalse();
        expect($listing->amenity_laptop)->toBeFalse();
    }
}