<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     * On ne garde que la structure de base (Rôles).
     */
    public function run(): void
    {
        // Création des rôles
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Vendeur', 'guard_name' => 'web']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Client', 'guard_name' => 'web']);

        // Création d'un administrateur par défaut
        $admin = \App\Models\User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrateur',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
            ]
        );

        $admin->syncRoles(['Admin']);
    }
}
