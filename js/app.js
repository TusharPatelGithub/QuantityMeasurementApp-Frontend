document.addEventListener('DOMContentLoaded', () => {
    // DOM Selection
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginFormContainer = document.getElementById('login-form-container');
    const signupFormContainer = document.getElementById('signup-form-container');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    // Callback & UI Toggle Logic
    const switchTab = (tabName) => {
        // Conditional logic
        if (tabName === 'login') {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginFormContainer.style.display = 'block';
            signupFormContainer.style.display = 'none';
        } else {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupFormContainer.style.display = 'block';
            loginFormContainer.style.display = 'none';
        }
    };

    // Event Handling
    loginTab.addEventListener('click', () => switchTab('login'));
    signupTab.addEventListener('click', () => switchTab('signup'));

    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    });

    // Object and Class usage
    class Validator {
        static isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        static isValidPassword(password) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
        }

        static isValidMobile(mobile) {
            return /^[0-9]{10}$/.test(mobile);
        }
    }

    // Dynamic UI rendering (Toast)
    const showToast = (message, type = 'success') => {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = message;
        
        toastContainer.appendChild(toast);
        
        // Timeout callback
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // Async Event Listeners
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        document.querySelectorAll('.error-message').forEach(el => el.innerText = '');
        
        const fullName = document.getElementById('signup-fullname').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const mobile = document.getElementById('signup-mobile').value.trim();
        
        let hasError = false;

        if (fullName.length < 3) {
            document.getElementById('signup-fullname-error').innerText = 'Name must be at least 3 characters.';
            hasError = true;
        }

        if (!Validator.isValidEmail(email)) {
            document.getElementById('signup-email-error').innerText = 'Please enter a valid email.';
            hasError = true;
        }

        if (!Validator.isValidPassword(password)) {
            document.getElementById('signup-password-error').innerText = 'Password must be 8+ chars, upper, lower, number, & special character.';
            hasError = true;
        }

        if (!Validator.isValidMobile(mobile)) {
            document.getElementById('signup-mobile-error').innerText = 'Mobile must be 10 digits.';
            hasError = true;
        }

        if (hasError) return;

        const submitBtn = document.getElementById('signup-submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerText = 'Creating Account...';

        try {
            await apiClient.register(fullName, email, password, mobile);
            showToast('Account created successfully! Please login.', 'success');
            signupForm.reset();
            switchTab('login');
        } catch (error) {
            showToast(error.message || 'Signup failed. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Signup';
        }
    });

    // Login Form Handler
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        document.querySelectorAll('.error-message').forEach(el => el.innerText = '');

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        
        let hasError = false;

        if (!Validator.isValidEmail(email)) {
            document.getElementById('login-email-error').innerText = 'Please enter a valid email.';
            hasError = true;
        }

        if (password.length === 0) {
            document.getElementById('login-password-error').innerText = 'Password is required.';
            hasError = true;
        }

        if (hasError) return;

        const submitBtn = document.getElementById('login-submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerText = 'Logging in...';

        try {
            const response = await apiClient.login(email, password);
            showToast('Login successful!', 'success');
            if(response && response.token) {
                localStorage.setItem('authToken', response.token);
                
                // Redirect to next measurement UI after short delay for toast to show
                setTimeout(() => {
                    window.location.href = 'measurement.html';
                }, 1000);
            }
        } catch (error) {
            showToast(error.message || 'Login failed. Check credentials.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Login';
        }
    });
});
