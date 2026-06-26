<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class VendorProductIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_vendor_cannot_see_other_vendors_products_in_manage(): void
    {
        Role::firstOrCreate(['name' => 'Vendeur', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);

        $vendorA = User::factory()->create(['vendor_status' => 'approved']);
        $vendorA->assignRole('Vendeur');

        $vendorB = User::factory()->create(['vendor_status' => 'approved']);
        $vendorB->assignRole('Vendeur');

        $productA = Product::create([
            'user_id' => $vendorA->id,
            'name' => 'Produit A',
            'slug' => 'produit-a',
            'description' => 'Desc',
            'category' => 'Cat',
            'price' => 10,
            'stock' => 1,
            'is_active' => true,
            'publication_status' => 'approved',
        ]);

        Product::create([
            'user_id' => $vendorB->id,
            'name' => 'Produit B',
            'slug' => 'produit-b',
            'description' => 'Desc',
            'category' => 'Cat',
            'price' => 20,
            'stock' => 1,
            'is_active' => true,
            'publication_status' => 'approved',
        ]);

        Sanctum::actingAs($vendorA);

        $this->getJson('/api/vendor/products')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['id' => $productA->id]);
    }

    public function test_vendor_cannot_update_or_delete_other_vendors_product(): void
    {
        Role::firstOrCreate(['name' => 'Vendeur', 'guard_name' => 'web']);

        $vendorA = User::factory()->create(['vendor_status' => 'approved']);
        $vendorA->assignRole('Vendeur');

        $vendorB = User::factory()->create(['vendor_status' => 'approved']);
        $vendorB->assignRole('Vendeur');

        $productA = Product::create([
            'user_id' => $vendorA->id,
            'name' => 'Produit A',
            'slug' => 'produit-a',
            'description' => 'Desc',
            'category' => 'Cat',
            'price' => 10,
            'stock' => 1,
            'is_active' => true,
            'publication_status' => 'approved',
        ]);

        Sanctum::actingAs($vendorB);

        $this->patchJson('/api/vendor/products/'.$productA->id, ['name' => 'HACK'])
            ->assertStatus(403);

        $this->deleteJson('/api/vendor/products/'.$productA->id)
            ->assertStatus(403);
    }
}

