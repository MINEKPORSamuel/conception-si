<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Créer les rôles par défaut de Spatie
        $roles = [];

        foreach (['Admin', 'Client', 'Vendeur'] as $roleName) {
            $roles[$roleName] = Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => 'web',
            ]);
        }

        // 2. Créer des utilisateurs de démonstration pour chaque rôle
        $demoUsers = [
            [
                'name' => 'Admin Demo',
                'email' => 'admin@example.com',
                'role' => 'Admin',
            ],
            [
                'name' => 'Vendeur Demo',
                'email' => 'vendeur@example.com',
                'role' => 'Vendeur',
                'vendor_status' => 'approved',
            ],
            [
                'name' => 'Client Demo',
                'email' => 'client@example.com',
                'role' => 'Client',
            ],
        ];

        foreach ($demoUsers as $demoUser) {
            $user = User::firstOrCreate(
                ['email' => $demoUser['email']],
                [
                    'name' => $demoUser['name'],
                    'password' => bcrypt('password'),
                ]
            );

            if (! $user->hasRole($demoUser['role'])) {
                $user->syncRoles([$demoUser['role']]);
            }

            if (array_key_exists('vendor_status', $demoUser)) {
                $user->vendor_status = $demoUser['vendor_status'];
                $user->save();
            }
        }

        // 3. Créer quelques produits de démonstration pour le catalogue public
        $products = [
            [
                'name' => 'Article pratique',
                'slug' => 'article-pratique',
                'description' => 'Produit polyvalent pensé pour la consultation rapide et la mise en avant.',
                'category' => 'Maison',
                'price' => 79.90,
                'image_url' => 'https://images.unsplash.com/photo-1516707570269-0f8a8c8f3c49?auto=format&fit=crop&w=1200&q=80',
                'whatsapp_number' => '+22890000001',
                'stock' => 24,
                'is_active' => true,
                'publication_status' => 'approved',
            ],
            [
                'name' => 'Accessoire polyvalent',
                'slug' => 'accessoire-polyvalent',
                'description' => 'Article de démonstration présenté de manière neutre pour le catalogue public.',
                'category' => 'Quotidien',
                'price' => 129.00,
                'image_url' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
                'whatsapp_number' => '+22890000002',
                'stock' => 18,
                'is_active' => true,
                'publication_status' => 'approved',
            ],
            [
                'name' => 'Objet du quotidien',
                'slug' => 'objet-du-quotidien',
                'description' => 'Produit de vitrine simple, utile pour tester la navigation et le contact vendeur.',
                'category' => 'Épicerie',
                'price' => 64.50,
                'image_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
                'whatsapp_number' => '+22890000003',
                'stock' => 31,
                'is_active' => true,
                'publication_status' => 'approved',
            ],
        ];

        foreach ($products as $productData) {
            Product::updateOrCreate(
                ['slug' => $productData['slug']],
                $productData
            );
        }
    }
}
