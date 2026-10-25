<?php

namespace Tests\Feature;

use Tests\FeatureTestCase;

pest:
    uses(FeatureTestCase::class)->in('Feature');

class AuthControllerTest extends FeatureTestCase
{
    /**
     * Test RegisterController validator rules.
     * 
     * AC-5: Feature tests for authentication routes
     */
    public function test_register_controller_validator(): void
    {
        $controller = new \App\Http\Controllers\Auth\RegisterController();
        
        $data = ['name' => 'John Doe', 'email' => 'john@example.com', 'password' => 'password', 'password_confirmation' => 'password'];
        $validator = $controller->validator($data);
        
        expect($validator->passes())->toBeTrue();
        
        $validator->validate();
    }

    /**
     * Test RegisterController create method.
     * 
     * AC-5: Feature tests for authentication routes
     */
    public function test_register_controller_create(): void
    {
        $controller = new \App\Http\Controllers\Auth\RegisterController();
        
        $data = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];
        
        $user = $controller->create($data);
        
        expect($user)->toBeInstanceOf(\App\Models\User::class);
        expect($user->name)->toBe('Jane Doe');
        expect($user->email)->toBe('jane@example.com');
        expect($user->password)->not->toBe('password123');
    }

    /**
     * Test user model validation.
     * 
     * AC-5: Feature tests for authentication routes
     */
    public function test_user_model_validation(): void
    {
        $user = new \App\Models\User();
        $user->name = 'Test User';
        $user->email = 'test@example.com';
        $user->password = 'password123';
        
        expect($user->name)->toBe('Test User');
        expect($user->email)->toBe('test@example.com');
        expect($user->password)->not->toBe('password123');
    }

    /**
     * Test user model hidden attributes.
     * 
     * AC-5: Feature tests for authentication routes
     */
    public function test_user_model_hidden_attributes(): void
    {
        $user = new \App\Models\User();
        $user->password = 'secret';
        
        expect($user->password)->not->toBe('secret');
        expect($user->getHidden())->toContain('password');
    }

    /**
     * Test Listing model boolean casts.
     * 
     * AC-5: Feature tests for authentication routes
     */
    public function test_listing_model_boolean_casts(): void
    {
        $listing = new \App\Listing();
        
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
     * 
     * AC-5: Feature tests for authentication routes
     */
    public function test_listing_model_cast_attributes(): void
    {
        $listing = new \App\Listing();
        
        $cast = $listing->getCasts();
        
        expect($cast)->toHaveKey('amenity_wifi');
        expect($cast)->toHaveKey('amenity_pets_allowed');
        expect($cast)->toHaveKey('amenity_tv');
        expect($cast)->toHaveKey('amenity_kitchen');
        expect($cast)->toHaveKey('amenity_breakfast');
        expect($cast)->toHaveKey('amenity_laptop');
    }
}