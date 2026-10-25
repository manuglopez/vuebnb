<?php

namespace App\Http\Controllers;

use App\Listing;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use Illuminate\View\Factory as ViewFactory;

class ListingController extends Controller
{
    /**
     * Display the listings for the web view.
     */
    public function get_home_web(Request $request): View
    {
        $listings = $this->getListingSummary();
        $data = collect(['listings' => $listings->toArray()]);
        $data = $this->addMetadata($data, $request);
        return view('app', ['data' => $data]);
    }

    /**
     * Display the listings for the API.
     */
    public function get_home_api(): JsonResponse
    {
        $data = $this->getListingSummary();
        return response()->json($data);
    }

    /**
     * Display a specific listing for the web view.
     */
    public function getListingWeb(Listing $listing, Request $request): View
    {
        $data = $this->listingGetImages($listing);
        $data = $this->addMetadata($data, $request);
        return view('app', ['data' => $data]);
    }

    /**
     * Display a specific listing for the API.
     */
    public function getListingApi(Listing $listing): JsonResponse
    {
        $data = $this->listingGetImages($listing);
        return response()->json($data);
    }

    /**
     * Add metadata to the data collection.
     */
    protected function addMetadata($collection, Request $request): mixed
    {
        return $collection->merge([
            'path' => $request->getPathInfo(),
        ]);
    }

    /**
     * Get listing images for a specific listing.
     */
    protected function listingGetImages(Listing $listing): mixed
    {
        $model = $listing->toArray();
        for ($i = 1; $i <= 4; $i++) {
            $model['image_' . $i] = asset('images/' . $listing->id . '/Image_' . $i . '.jpg');
        }
        return collect(['listing' => $model]);
    }

    /**
     * Get the listing summary data.
     */
    protected function getListingSummary(): \Illuminate\Database\Eloquent\Collection
    {
        $collection = Listing::all([
            'id',
            'address',
            'title',
            'price_per_night',
        ]);
        $collection->transform(function ($listing) {
            $listing->thumb = asset('images/' . $listing->id . '/Image_1_thumb.jpg');
            return $listing;
        });

        return $collection;
    }
}