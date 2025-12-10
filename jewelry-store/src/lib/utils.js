export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

export const getFriendlyErrorMessage = (error) => {
    if (!error) return "An unexpected error occurred.";

    // Logic for axios error response
    if (error.response) {
        const { status, data } = error.response;

        // Message from backend if available and clear
        if (data && data.message) {
            // Sometimes backend sends specific messages we might want to pass through if they are good
            // But if we want to enforce friendliness:
        }

        switch (status) {
            case 400:
                return "Please check your input details and try again.";
            case 401:
            case 403:
                return "Incorrect email or password.";
            case 404:
                return "Resource not found.";
            case 409: // Conflict
                return "This email is already associated with an account.";
            case 500:
                return "Server error. Please try again later.";
            default:
                return data?.errors?.[0]?.message || data?.message || "Something went wrong. Please try again.";
        }
    }

    // Network errors or other
    if (error.message === 'Network Error') {
        return "Unable to connect to the server. Please check your internet connection.";
    }

    return error.message || "An unexpected error occurred.";
};
