<?php

namespace App\Http\Controllers;

use App\Listing;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function get_home_api()
    {
        $data = $this->getListingSumary();

        return response()->json($data);
    }

    /**
     * @param  Request  $request
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function get_home_web(Request $request)
    {
        $collection = $this->getListingSumary();
        $data = collect(['listings' => $collection->toArray()]);
        $data = $this->addMetaData($data, $request);

        return view('app', ['data' => $data]);
    }

    /**
     * @param  Listing  $listing
     * @return \Illuminate\Http\JsonResponse
     */
    public function getListingApi(Listing $listing)
    {
        $data = $this->listingGetImages($listing);

        return response()->json($data);
    }

    /**
     * @param  Listing  $listing
     * @param  Request  $request
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getListingWeb(Listing $listing, Request $request)
    {
        $data = $this->listingGetImages($listing);
        $data = $this->addMetaData($data, $request);

        return view('app', ['data' => $data]);
    }

    /**
     * @param $collection
     * @param $request
     * @return mixed
     */
    protected function addMetaData($collection, $request)
    {
        return $collection->merge([
            'path' => $request->getPathInfo(),
        ]);
    }

    /**
     * @param  Listing  $listing
     * @return mixed
     */
    protected function listingGetImages(Listing $listing)
    {
        $model = $listing->toArray();
        for ($i = 1; $i <= 4; $i++) {
            $model['image_'.$i] = asset('images/'.$listing->id.'/Image_'.$i.'.jpg');
        }

        return collect(['listing' => $model]);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    protected function getListingSumary()
    {
        $collection = Listing::all([
            'id',
            'address',
            'title',
            'price_per_night',
        ]);
        $collection->transform(function ($listing) {
            $listing->thumb = asset('images/'.$listing->id.'/Image_1_thumb.jpg');

            return $listing;
        });

        return $collection;
    }
}
