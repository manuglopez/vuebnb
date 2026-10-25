<?php
/**
 * Test to verify the boolean casts functionality in Listing model
 */

use Tests\TestCase;

pest:
    uses(TestCase::class)->in('Unit');

class ListingBooleanCastsTest extends TestCase
{
    /**
     * Test that all boolean cast attributes work correctly
     */
    public function test_listing_model_all_boolean_casts(): void
    {
        $listing = new \App\Listing();
        
        // Test each boolean attribute
        $attributes = [
            'amenity_wifi',
            'amenity_pets_allowed', 
            'amenity_tv',
            'amenity_kitchen',
            'amenity_breakfast',
            'amenity_laptop',
        ];
        
        foreach ($attributes as $attribute) {
            // Set to false
            $listing->$attribute = false;
            expect($listing->$attribute)->toBeFalse();
            
            // Set to true
            $listing->$attribute = true;
            expect($listing->$attribute)->toBeTrue();
        }
    }

    /**
     * Test that boolean cast attributes are properly cast
     */
    public function test_listing_model_boolean_cast_types(): void
    {
        $listing = new \App\Listing();
        
        // Manually set properties to test casting
        $listing->amenity_wifi = "false"; // string that should be cast to boolean
        $listing->amenity_pets_allowed = "1"; // string that should be cast to boolean
        
        expect($listing->amenity_wifi)->toBeFalse();
        expect($listing->amenity_pets_allowed)->toBeTrue();
    }

    /**
     * Test that boolean cast attributes are in the model casts
     */
    public function test_listing_model_boolean_cast_definition(): void
    {
        $listing = new \App\Listing();
        $casts = $listing->getCasts();
        
        $expectedBooleanCasts = [
            'amenity_wifi',
            'amenity_pets_allowed',
            'amenity_tv', 
            'amenity_kitchen',
            'amenity_breakfast',
            'amenity_laptop',
        ];
        
        foreach ($expectedBooleanCasts as $cast) {
            expect(array_key_exists($cast, $casts))->toBeTrue();
            expect($casts[$cast])->toBe('boolean');
        }
    }
}