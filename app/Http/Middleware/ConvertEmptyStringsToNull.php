<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull as Middleware;

class ConvertEmptyStringsToNull extends Middleware
{
    /**
     * The URIs that should be excluded from conversion.
     *
     * @var array
     */
    protected $except = [
        //
    ];
}