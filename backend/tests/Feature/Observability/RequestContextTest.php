<?php

namespace Tests\Feature\Observability;

use Tests\TestCase;

class RequestContextTest extends TestCase
{
    public function test_api_response_contains_request_id_header(): void
    {
        $response = $this->getJson('/api/products');

        $response->assertOk();
        $response->assertHeader('X-Request-Id');
    }
}

