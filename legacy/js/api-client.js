class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    // ES9 concepts: async/await, try/catch for exception handling
    async post(endpoint, data) {
        try {
            const token = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            // Exception handling
            if (!response.ok) {
                // Using Promises to catch JSON decode error if body is empty
                const errorData = await response.json().catch(() => null);
                // Optional chaining (ES9/ES11)
                throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // AJAX implementations
    async login(email, password) {
        return this.post('/api/Auth/login', { email, password });
    }

    async register(fullName, email, password, mobileNumber) {
        return this.post('/api/Auth/register', { 
            fullName, 
            email, 
            password, 
            mobileNumber 
        });
    }

    async convert(value, unit, type, targetUnit) {
        const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
        return this.post('/api/v1/quantities/convert', {
            first: {
                value: parseFloat(value),
                unit: unit.toUpperCase(),
                measurementType: formattedType,
            },
            targetUnit: targetUnit.toUpperCase(),
        });
    }
}

// Update this to your local backend if you don't want the 10-second Render spin-up delay!
// For now, left as is so it doesn't break external testing if that's intended.
const apiClient = new ApiClient('https://quantitymeasurementapp-zjm0.onrender.com');

