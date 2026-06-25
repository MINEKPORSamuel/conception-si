export const getUserRoles = (user) => user?.roles || (user?.role ? [user.role] : []);

export const isAdmin = (user) => getUserRoles(user).includes('Admin');

export const isApprovedVendor = (user) => {
    return getUserRoles(user).includes('Vendeur') && user?.vendor_status === 'approved';
};

export const isPendingVendor = (user) => {
    return getUserRoles(user).includes('Vendeur') && user?.vendor_status === 'pending';
};

export const resolveLandingPath = (user) => {
    if (isAdmin(user)) {
        return '/administration';
    }

    if (isApprovedVendor(user)) {
        return '/vendeur';
    }

    return '/compte';
};
