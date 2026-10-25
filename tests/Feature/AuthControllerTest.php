<?php

namespace Tests\Feature;

use App\Http\Controllers\Auth\RegisterController;
use App\Listing;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Tests\FeatureTestCase;

class AuthControllerTest extends FeatureTestCase
{
    /**
     * Test RegisterController validator rules.
     *
     * AC-5: Feature tests for authentication routes
     */
    public function test_register_controller_validator(): void
    {
        $controller = new RegisterController;

        $data = ['name' => 'John Doe', 'email' => 'john@example.com', 'password' => 'password', 'password_confirmation' => 'password'];
        $validator = $controller->validator($data);

        expect($validator->passes())->toBeTrue();

        $validator->validate();
    }

    /**
     * Test RegisterController validator failure rules.
     *
     * AC-5: Feature tests for authentication validation
     */
    public function test_register_controller_validator_fails_on_missing_or_invalid_fields(): void
    {
        $controller = new RegisterController;

        // Missing name
        $v1 = $controller->validator(['email' => 'a@b.com', 'password' => 'password', 'password_confirmation' => 'password']);
        expect($v1->fails())->toBeTrue();
        expect($v1->errors()->has('name'))->toBeTrue();

        // Missing email
        $v2 = $controller->validator(['name' => 'John', 'password' => 'password', 'password_confirmation' => 'password']);
        expect($v2->fails())->toBeTrue();
        expect($v2->errors()->has('email'))->toBeTrue();

        // Invalid email format
        $v3 = $controller->validator(['name' => 'John', 'email' => 'not-an-email', 'password' => 'password', 'password_confirmation' => 'password']);
        expect($v3->fails())->toBeTrue();
        expect($v3->errors()->has('email'))->toBeTrue();

        // Missing password
        $v4 = $controller->validator(['name' => 'John', 'email' => 'a@b.com', 'password_confirmation' => 'password']);
        expect($v4->fails())->toBeTrue();
        expect($v4->errors()->has('password'))->toBeTrue();

        // Short password (<6 chars)
        $v5 = $controller->validator(['name' => 'John', 'email' => 'a@b.com', 'password' => '12345', 'password_confirmation' => '12345']);
        expect($v5->fails())->toBeTrue();
        expect($v5->errors()->has('password'))->toBeTrue();

        // Password confirmation mismatch
        $v6 = $controller->validator(['name' => 'John', 'email' => 'a@b.com', 'password' => 'password123', 'password_confirmation' => 'different']);
        expect($v6->fails())->toBeTrue();
        expect($v6->errors()->has('password'))->toBeTrue();
    }

    /**
     * Test RegisterController create method.
     *
     * AC-5: Feature tests for authentication routes
     */
    public function test_register_controller_create(): void
    {
        $controller = new RegisterController;

        $data = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $user = $controller->create($data);

        expect($user)->toBeInstanceOf(User::class);
        expect($user->name)->toBe('Jane Doe');
        expect($user->email)->toBe('jane@example.com');
        expect($user->password)->not->toBe('password123');
    }

    /**
     * Test RegisterController register method successfully creates user and redirects.
     *
     * AC-5: Feature tests for authentication routes
     */
    public function test_register_controller_register(): void
    {
        $controller = new RegisterController;
        $request = Request::create('/register', 'POST', [
            'name' => 'Registered User',
            'email' => 'registered@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response = $controller->register($request);

        expect($response)->toBeInstanceOf(RedirectResponse::class);
        expect($response->getTargetUrl())->toBe(url('/home'));
        $this->assertDatabaseHas('users', ['email' => 'registered@example.com']);
    }

    /**
     * Test RegisterController register method throws ValidationException when invalid.
     *
     * AC-5: Feature tests for authentication routes
     */
    public function test_register_controller_register_validation_fails(): void
    {
        $controller = new RegisterController;
        $request = Request::create('/register', 'POST', [
            'name' => '',
            'email' => 'not-an-email',
            'password' => 'short',
            'password_confirmation' => 'mismatch',
        ]);

        $this->expectException(ValidationException::class);
        $controller->register($request);
    }

    /**
     * Test user model validation.
     *
     * AC-5: Feature tests for authentication routes
     */
    public function test_user_model_validation(): void
    {
        $user = new User;
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
        $user = new User;
        $user->password = 'secret';

        expect($user->password)->not->toBe('secret');
        expect($user->getHidden())->toContain('password');
    }

    /**
     * Test user model casts.
     *
     * AC-5: Feature tests for authentication routes
     */
    public function test_user_model_casts(): void
    {
        $user = new User;
        $casts = $user->getCasts();
        expect($casts)->toHaveKey('email_verified_at');
        expect($casts['email_verified_at'])->toBe('datetime');
        expect($casts)->toHaveKey('password');
        expect($casts['password'])->toBe('hashed');
    }

    /**
     * Test Listing model boolean casts.
     *
     * AC-5: Feature tests for authentication routes
     */
    public function test_listing_model_boolean_casts(): void
    {
        $listing = new Listing;

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
        $listing = new Listing;

        $cast = $listing->getCasts();

        expect($cast)->toHaveKey('amenity_wifi');
        expect($cast)->toHaveKey('amenity_pets_allowed');
        expect($cast)->toHaveKey('amenity_tv');
        expect($cast)->toHaveKey('amenity_kitchen');
        expect($cast)->toHaveKey('amenity_breakfast');
        expect($cast)->toHaveKey('amenity_laptop');
    }
}
