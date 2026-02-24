<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Bypass only in local development with debug enabled.
        if (app()->environment('local') && config('app.debug')) {
            \Log::warning('AdminMiddleware bypassed in development mode');

            // Set a fake admin user for development mode so history tracking works.
            if (!$request->user()) {
                $fakeUser = User::where('role', 'admin')->first();
                if ($fakeUser) {
                    \Auth::login($fakeUser);
                }
            }

            return $next($request);
        }

        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Vous devez etre connecte pour acceder a cette page.',
                'errors' => ['auth' => ['Non authentifie.']],
            ], 401);
        }

        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Acces refuse. Permissions insuffisantes.',
                'errors' => ['authorization' => ['Permissions insuffisantes.']],
            ], 403);
        }

        return $next($request);
    }
}
