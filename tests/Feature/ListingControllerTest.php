<?php

namespace Tests\Feature;

use App\Http\Controllers\ListingController;
use App\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\View\View;
use Tests\FeatureTestCase;

class ListingControllerTest extends FeatureTestCase
{
    /**
     * Test the home route returns a successful response with valid listings summary and metadata.
     *
     * AC-4 / ListingController: get_home_web returns app view with metadata and listings
     */
    public function test_home_route_returns_successful_response(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertViewIs('app');
        $response->assertViewHas('data');

        $data = $response->viewData('data');
        expect($data)->toBeInstanceOf(Collection::class);
        expect($data->get('path'))->toBe('/');
        expect($data->has('listings'))->toBeTrue();

        $listings = $data->get('listings');
        expect($listings)->toBeArray();
        expect(count($listings))->toBeGreaterThan(0);

        $first = $listings[0];
        expect($first)->toHaveKeys(['id', 'address', 'title']);
    }

    /**
     * Test the saved route returns a successful response with path /saved.
     *
     * AC-4 / ListingController: get_home_web on /saved
     */
    public function test_saved_route_returns_successful_response(): void
    {
        $response = $this->get('/saved');
        $response->assertStatus(200);
        $response->assertViewIs('app');
        $response->assertViewHas('data');

        $data = $response->viewData('data');
        expect($data)->toBeInstanceOf(Collection::class);
        expect($data->get('path'))->toBe('/saved');
        expect($data->has('listings'))->toBeTrue();
    }

    /**
     * Test the listing route returns a successful response with 4 images and metadata.
     *
     * AC-4 / ListingController: getListingWeb returns app view with 4 images and metadata
     */
    public function test_listing_route_returns_successful_response(): void
    {
        $listing = Listing::first();
        $response = $this->get('/listing/'.$listing->id);
        $response->assertStatus(200);
        $response->assertViewIs('app');
        $response->assertViewHas('data');

        $data = $response->viewData('data');
        expect($data)->toBeInstanceOf(Collection::class);
        expect($data->get('path'))->toBe('/listing/'.$listing->id);
        expect($data->has('listing'))->toBeTrue();

        $model = $data->get('listing');
        expect($model)->toBeArray();
        expect($model['id'])->toBe($listing->id);
        expect($model['image_1'])->toBe(asset('images/'.$listing->id.'/Image_1.jpg'));
        expect($model['image_2'])->toBe(asset('images/'.$listing->id.'/Image_2.jpg'));
        expect($model['image_3'])->toBe(asset('images/'.$listing->id.'/Image_3.jpg'));
        expect($model['image_4'])->toBe(asset('images/'.$listing->id.'/Image_4.jpg'));
        expect(array_key_exists('image_0', $model))->toBeFalse();
        expect(array_key_exists('image_5', $model))->toBeFalse();
    }

    /**
     * Test the listing route returns 404 for a non-existent listing.
     *
     * AC-4 / ListingController: 404 for nonexistent listing
     */
    public function test_listing_route_returns_404_for_nonexistent_listing(): void
    {
        $response = $this->get('/listing/99999');
        $response->assertStatus(404);
    }

    /**
     * Test ListingController get_home_api returns JsonResponse with listings summary.
     *
     * AC-4 / ListingController: get_home_api
     */
    public function test_get_home_api_returns_json_response(): void
    {
        $controller = new ListingController;
        $response = $controller->get_home_api();

        expect($response)->toBeInstanceOf(JsonResponse::class);
        expect($response->getStatusCode())->toBe(200);

        $data = json_decode($response->getContent(), true);
        expect($data)->toBeArray();
        expect(count($data))->toBeGreaterThan(0);

        $first = $data[0];
        expect($first)->toHaveKeys(['id', 'address', 'title']);
    }

    /**
     * Test ListingController getListingApi returns JsonResponse with 4 images.
     *
     * AC-4 / ListingController: getListingApi
     */
    public function test_get_listing_api_returns_json_response(): void
    {
        $listing = Listing::first();
        $controller = new ListingController;
        $response = $controller->getListingApi($listing);

        expect($response)->toBeInstanceOf(JsonResponse::class);
        expect($response->getStatusCode())->toBe(200);

        $data = json_decode($response->getContent(), true);
        expect($data)->toBeArray();
        expect($data)->toHaveKey('listing');

        $model = $data['listing'];
        expect($model['id'])->toBe($listing->id);
        expect($model['image_1'])->toBe(asset('images/'.$listing->id.'/Image_1.jpg'));
        expect($model['image_2'])->toBe(asset('images/'.$listing->id.'/Image_2.jpg'));
        expect($model['image_3'])->toBe(asset('images/'.$listing->id.'/Image_3.jpg'));
        expect($model['image_4'])->toBe(asset('images/'.$listing->id.'/Image_4.jpg'));
        expect(array_key_exists('image_0', $model))->toBeFalse();
        expect(array_key_exists('image_5', $model))->toBeFalse();
    }

    /**
     * Test get_home_web with custom request pathinfo.
     *
     * AC-4 / ListingController: addMetadata
     */
    public function test_get_home_web_with_custom_request(): void
    {
        $controller = new ListingController;
        $request = Request::create('/custom-test-path');
        $view = $controller->get_home_web($request);

        expect($view)->toBeInstanceOf(View::class);
        $data = $view->getData()['data'];
        expect($data->get('path'))->toBe('/custom-test-path');
    }

    /**
     * Test ListingController protected methods and thumb generation.
     *
     * AC-4 / ListingController: protected methods accessibility and thumbnail construction
     */
    public function test_listing_controller_protected_methods_and_thumb_generation(): void
    {
        $controller = new TestableListingController;
        $listing = Listing::first();
        $request = Request::create('/custom-meta-path');

        $meta = $controller->publicAddMetadata(collect(['foo' => 'bar']), $request);
        expect($meta->get('path'))->toBe('/custom-meta-path');
        expect($meta->get('foo'))->toBe('bar');

        $images = $controller->publicListingGetImages($listing);
        $listingData = $images->get('listing');
        expect($listingData['image_1'])->toBe(asset('images/'.$listing->id.'/Image_1.jpg'));

        $summary = $controller->publicGetListingSummary();
        expect($summary->count())->toBeGreaterThan(0);
        $first = $summary->first();
        expect($first->thumb)->toBe(asset('images/'.$first->id.'/Image_1_thumb.jpg'));
    }
}

class TestableListingController extends ListingController
{
    public function publicAddMetadata($collection, Request $request): mixed
    {
        return $this->addMetadata($collection, $request);
    }

    public function publicListingGetImages(Listing $listing): mixed
    {
        return $this->listingGetImages($listing);
    }

    public function publicGetListingSummary(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->getListingSummary();
    }
}
