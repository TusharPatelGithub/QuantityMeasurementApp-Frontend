class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    // ES9 concepts: async/await, try/catch for exception handling
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Exception handling
            if (!response.ok) {
                // Using Promises to catch JSON decode error if body is empty
                const errorData = await response.json().catch(() => null);
                // Optional chaining (ES9/ES11)
                throw new Error(errorData?.error || errorData?.message || `HTTP Error: ${response.status}`);
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
}

const apiClient = new ApiClient('http://localhost:5000');
