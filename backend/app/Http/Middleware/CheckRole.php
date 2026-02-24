<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifie.',
                'errors' => ['auth' => ['Non authentifie.']],
            ], 401);
        }

        if (!in_array($request->user()->role, $roles, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Acces interdit. Permissions insuffisantes.',
                'errors' => ['authorization' => ['Permissions insuffisantes.']],
            ], 403);
        }

        return $next($request);
    }
}
