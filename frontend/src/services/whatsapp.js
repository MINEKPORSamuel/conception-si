const DEFAULT_WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '';

export const buildWhatsAppUrl = (phoneNumber = DEFAULT_WHATSAPP_NUMBER, message = '') => {
    if (!phoneNumber) {
        return '';
    }

    const digits = String(phoneNumber).replace(/[^\d]/g, '');
    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${digits}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};

