<?php

namespace App\Http\Middleware;

use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse as Middleware;

class AddQueuedCookiesToResponse extends Middleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, $next)
    {
        $response = $next($request);
        $response->headers->set('Set-Cookie', $response->headers->get('Set-Cookie', ''), false);
        return $response;
    }
}