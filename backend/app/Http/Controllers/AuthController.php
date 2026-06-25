<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $allowedRoles = ['Client', 'Vendeur'];

        foreach ($allowedRoles as $roleName) {
            Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => 'web',
            ]);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', Rule::in($allowedRoles)],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'vendor_status' => $data['role'] === 'Vendeur' ? 'approved' : null,
        ]);

        $user->assignRole($data['role']);

        $token = $user->createToken('marché-libre')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $this->formatUser($user),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::query()
            ->where('email', $credentials['email'])
            ->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('marché-libre')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $this->formatUser($user),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(null, 401);
        }

        return response()->json($this->formatUser($user));
    }

    public function logout(Request $request): Response
    {
        if ($request->user()?->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->noContent();
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
        ];
    }
}
