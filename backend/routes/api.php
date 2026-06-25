<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product:slug}', [ProductController::class, 'show']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
});

Route::middleware(['auth:sanctum', 'role:Vendeur|Admin'])->group(function () {
    Route::get('/vendor/products', [ProductController::class, 'manage']);
    Route::post('/vendor/products', [ProductController::class, 'store']);
    Route::patch('/vendor/products/{product}', [ProductController::class, 'update']);
    Route::delete('/vendor/products/{product}', [ProductController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::patch('/admin/users/{user}/role', [AdminController::class, 'updateRole']);
    Route::patch('/admin/users/{user}/vendor-status', [AdminController::class, 'updateVendorStatus']);
    Route::patch('/admin/products/{product}/publication', [AdminController::class, 'updatePublication']);
});
