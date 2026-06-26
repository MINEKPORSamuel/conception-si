<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function users(): JsonResponse
    {
        $users = User::query()
            ->with('roles')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn (User $user) => $this->formatUser($user));

        return response()->json($users);
    }

    public function updateRole(Request $request, User $user): JsonResponse
    {
        if ($user->hasRole('Admin')) {
            return response()->json(['message' => 'Impossible de rétrograder un administrateur.'], 403);
        }

        $data = $request->validate([
            'role' => ['required', 'string', Rule::in(['Client', 'Vendeur'])], // On retire 'Admin' des choix possibles
        ]);

        $user->syncRoles([$data['role']]);
        $user->vendor_status = $data['role'] === 'Vendeur' ? 'approved' : null;
        $user->save();

        return response()->json($this->formatUser($user->refresh()));
    }

    public function updateVendorStatus(Request $request, User $user): JsonResponse
    {
        if ($user->hasRole('Admin')) {
            return response()->json(['message' => 'Impossible de modifier un administrateur.'], 403);
        }

        $data = $request->validate([
            'vendor_status' => ['required', 'string', Rule::in(['pending', 'approved', 'rejected'])],
        ]);

        $user->vendor_status = $data['vendor_status'];

        if ($data['vendor_status'] === 'approved') {
            $user->syncRoles(['Vendeur']);
        } elseif ($data['vendor_status'] === 'rejected') {
            $user->syncRoles(['Client']);
        } elseif (! $user->hasRole('Vendeur')) {
            $user->syncRoles(['Vendeur']);
        }

        $user->save();

        return response()->json($this->formatUser($user->refresh()));
    }

    public function updatePublication(Request $request, Product $product): JsonResponse
    {
        $data = $request->validate([
            'publication_status' => ['required', 'string', Rule::in(['pending', 'approved', 'rejected'])],
        ]);

        $product->publication_status = $data['publication_status'];
        $product->save();

        return response()->json([
            'message' => 'Statut de publication mis à jour.',
            'product' => $product->fresh(),
        ]);
    }

    private function formatUser(User $user): array
    {
        $roles = $user->getRoleNames()->values()->all();

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $roles[0] ?? 'Client',
            'roles' => $roles,
            'vendor_status' => $user->vendor_status,
            'created_at' => $user->created_at?->toDateTimeString(),
        ];
    }
}
