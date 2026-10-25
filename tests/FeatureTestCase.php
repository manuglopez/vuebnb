<?php

namespace Tests;

use Database\Seeders\ListingsTableSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

/**
 * Base test case for Feature tests using Pest framework.
 */
class FeatureTestCase extends BaseTestCase
{
    use RefreshDatabase;

    /**
     * Seed the listings table before each test.
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ListingsTableSeeder::class);
    }
}
