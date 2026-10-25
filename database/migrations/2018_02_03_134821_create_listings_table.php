<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('address');
            $table->longText('about');

            // Amenities
            $table->boolean('amenity_wifi')->default(false);
            $table->boolean('amenity_pets_allowed')->default(false);
            $table->boolean('amenity_tv')->default(false);
            $table->boolean('amenity_kitchen')->default(false);
            $table->boolean('amenity_breakfast')->default(false);
            $table->boolean('amenity_laptop')->default(false);

            // Prices
            $table->string('price_per_night')->nullable();
            $table->string('price_extra_people')->nullable();
            $table->string('price_weekly_discount')->nullable();
            $table->string('price_monthly_discount')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
