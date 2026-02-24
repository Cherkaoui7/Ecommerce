<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);

        // Add request correlation context and response request-id header.
        $middleware->append(\App\Http\Middleware\RequestContext::class);
        
        // API CORS Configuration
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->report(function (\Throwable $exception): void {
            $request = app()->bound('request') ? request() : null;

            $alertContext = [
                'request_id' => $request?->attributes->get('request_id') ?? $request?->header('X-Request-Id'),
                'exception_class' => get_class($exception),
                'message' => $exception->getMessage(),
                'url' => $request?->fullUrl(),
                'method' => $request?->method(),
                'user_id' => $request?->user()?->id,
            ];

            if (!empty(config('logging.channels.slack.url'))) {
                Log::channel('slack')->critical('exception.alert', $alertContext);
            }
        });
    })->create();
