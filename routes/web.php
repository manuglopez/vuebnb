<?php

use App\Http\Controllers\ListingController;
use Illuminate\Support\Facades\Route;

// Web routes for the application - Laravel 13 style
Route::get('/', [ListingController::class, 'get_home_web']);
Route::get('/saved', [ListingController::class, 'get_home_web']);
Route::get('/listing/{listing}', [ListingController::class, 'getListingWeb']);