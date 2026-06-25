export const getUserRoles = (user) => user?.roles || (user?.role ? [user.role] : []);

export const isAdmin = (user) => getUserRoles(user).includes('Admin');

export const isVendor = (user) => getUserRoles(user).includes('Vendeur');

export const resolveLandingPath = (user) => {
    if (isAdmin(user)) {
        return '/administration';
    }

    if (isVendor(user)) {
        return '/vendeur';
    }

    // Le client reste sur le catalogue public après connexion
    return '/catalogue';
};
