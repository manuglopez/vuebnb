<?php

namespace App\Http\Controllers;

use App\Listing;
use Illuminate\Http\Request;

class ListingController extends Controller {

	private function add_meta_data( $collection, $request ) {
		return $collection->merge( [
			'path' => $request->getPathInfo()
		] );
	}

	public function get_home_web( Request $request ) {
		$collection = $this->getListingThumbnail();
		$data       = collect( [ 'listings' => $collection->toArray() ] );
		$data       = $this->add_meta_data( $data, $request );

		return view( 'app', [ 'data' => $data ] );
	}

	public function getListingApi( Listing $listing ) {

		$data = $this->listingGetImages( $listing );

		return response()->json( $data );
	}

	public function getListingWeb( Listing $listing, Request $request ) {

		$data = $this->listingGetImages( $listing );
		$data = $this->add_meta_data( $data, $request );

		return view( 'app', [ 'data' => $data ] );
	}

	/**
	 * @param Listing $listing
	 *
	 *
	 * @return mixed
	 */
	protected function listingGetImages( Listing $listing ) {
		$model = $listing->toArray();
		for ( $i = 1; $i <= 4; $i ++ ) {
			$model[ 'image_' . $i ] = asset( 'images/' . $listing->id . '/Image_' . $i . '.jpg' );
		}

		return collect( [ 'listing' => $model ] );
	}

	/**
	 * @return \Illuminate\Database\Eloquent\Collection|static[]
	 */
	protected function getListingThumbnail() {
		$collection = Listing::all( [
			'id',
			'address',
			'title',
			'price_per_night'
		] );
		$collection->transform( function ( $listing ) {
			$listing->thumb = asset(
				'images/' . $listing->id . '/Image_1_thumb.jpg'
			);

			return $listing;
		} );

		return $collection;
	}
}
