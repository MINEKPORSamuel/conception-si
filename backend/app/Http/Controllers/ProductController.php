<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::query()
            ->where('is_active', true)
            ->where('publication_status', 'approved')
            ->orderBy('created_at', 'desc')
            ->paginate(12); // Pagination pour la performance

        return response()->json($products);
    }

    public function show(Product $product): JsonResponse
    {
        if (! $product->is_active || $product->publication_status !== 'approved') {
            return response()->json(['message' => 'Produit introuvable.'], 404);
        }

        return response()->json($product);
    }

    public function manage(): JsonResponse
    {
        $products = Product::query()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($products);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'description' => ['required', 'string'],
            'category' => ['nullable', 'string', 'max:120'],
            'price' => ['required', 'numeric', 'min:0'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'image' => ['nullable', 'image', 'max:5120'], // 5MB max
            'whatsapp_number' => ['nullable', 'string', 'max:32'],
            'stock' => ['required', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $imageUrl = $this->normalizeNullableString($data['image_url'] ?? null);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = asset('storage/'.$path);
        }

        $product = Product::create([
            'user_id' => $request->user()->id,
            'name' => $data['name'],
            'slug' => $this->makeUniqueSlug($data['slug'] ?? $data['name']),
            'description' => $data['description'],
            'category' => $this->normalizeNullableString($data['category'] ?? null),
            'price' => $data['price'],
            'image_url' => $imageUrl,
            'whatsapp_number' => $this->normalizeNullableString($data['whatsapp_number'] ?? null),
            'stock' => $data['stock'],
            'is_active' => $data['is_active'] ?? true,
            'publication_status' => 'approved', // Publication automatique
        ]);

        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'category' => ['nullable', 'string', 'max:120'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'image' => ['nullable', 'image', 'max:5120'],
            'whatsapp_number' => ['nullable', 'string', 'max:32'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $product->image_url = asset('storage/'.$path);
        } elseif (array_key_exists('image_url', $data)) {
            $product->image_url = $this->normalizeNullableString($data['image_url']);
        }

        if (array_key_exists('slug', $data) || array_key_exists('name', $data)) {
            $source = $data['slug'] ?? $data['name'] ?? $product->name;
            $product->slug = $this->makeUniqueSlug($source, $product->id);
        }

        if (array_key_exists('name', $data)) {
            $product->name = $data['name'];
        }

        if (array_key_exists('description', $data)) {
            $product->description = $data['description'];
        }

        if (array_key_exists('category', $data)) {
            $product->category = $this->normalizeNullableString($data['category']);
        }

        if (array_key_exists('price', $data)) {
            $product->price = $data['price'];
        }

        if (array_key_exists('whatsapp_number', $data)) {
            $product->whatsapp_number = $this->normalizeNullableString($data['whatsapp_number']);
        }

        if (array_key_exists('stock', $data)) {
            $product->stock = $data['stock'];
        }

        if (array_key_exists('is_active', $data)) {
            $product->is_active = $data['is_active'];
        }

        $product->save();

        return response()->json($product);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(['message' => 'Produit supprimé.']);
    }

    private function makeUniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value) ?: 'produit';
        $slug = $base;
        $index = 2;

        while (
            Product::query()
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$index;
            $index++;
        }

        return $slug;
    }

    private function normalizeNullableString(?string $value): ?string
    {
        $trimmed = trim((string) $value);

        return $trimmed === '' ? null : $trimmed;
    }
}
