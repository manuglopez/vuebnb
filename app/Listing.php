<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    protected $casts = [
        'amenity_wifi' => 'boolean',
        'amenity_pets_allowed' => 'boolean',
        'amenity_tv' => 'boolean',
        'amenity_kitchen' => 'boolean',
        'amenity_breakfast' => 'boolean',
        'amenity_laptop' => 'boolean',
    ];

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'address',
        'about',
        'amenity_wifi',
        'amenity_pets_allowed',
        'amenity_tv',
        'amenity_kitchen',
        'amenity_breakfast',
        'amenity_laptop',
        'price_per_night',
        'price_extra_people',
        'price_weekly_discount',
        'price_monthly_discount',
    ];

    /**
     * The attributes that should be visible in arrays.
     */
    protected $visible = [
        'id',
        'title',
        'address',
        'about',
    ];
}
