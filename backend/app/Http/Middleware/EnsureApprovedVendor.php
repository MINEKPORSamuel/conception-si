<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureApprovedVendor
{
    /**
     * Handle an incoming request.
     *
     * Vendors must be approved by an administrator before they can access
     * the vendor area. Admins always bypass this check.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->hasRole('Admin')) {
            return $next($request);
        }

        if ($user->hasRole('Vendeur') && $user->vendor_status !== 'approved') {
            return response()->json([
                'message' => 'Votre compte vendeur est en attente de validation.',
            ], 403);
        }

        return $next($request);
    }
}
