document.addEventListener('DOMContentLoaded', () => {
    // Authentication Check
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // Units configuration
    const units = {
        length: ['Millimeter', 'Centimeter', 'Meter', 'Kilometer', 'Inch', 'Foot', 'Yard', 'Mile'],
        volume: ['Milliliter', 'Liter', 'Gallon'],
        weight: ['Gram', 'Kilogram', 'Ounce', 'Pound', 'Tonne'],
        temperature: ['Celsius', 'Fahrenheit', 'Kelvin']
    };

    // DOM Elements
    const typeBtns = document.querySelectorAll('.type-btn');
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    const fromValueInput = document.getElementById('from-value');
    const toValueInput = document.getElementById('to-value');
    const logoutBtn = document.getElementById('logout-btn');
    const formulaText = document.getElementById('formula-text');

    let currentType = 'length';

    // Initialize units based on selected type
    function loadUnits(type) {
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';
        
        const typeUnits = units[type];
        typeUnits.forEach(unit => {
            fromUnitSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
            toUnitSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
        });

        // Default selections
        if(typeUnits.length > 1) {
            fromUnitSelect.selectedIndex = 0;
            toUnitSelect.selectedIndex = 1;
        }
    }

    // Handlers
    function handleTypeChange(e) {
        const btn = e.currentTarget;
        
        // UI updates
        typeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Data updates
        currentType = btn.getAttribute('data-type');
        loadUnits(currentType);
        performConversion();
    }

    function performConversion() {
        const fromVal = parseFloat(fromValueInput.value);
        if (isNaN(fromVal)) {
            toValueInput.value = '';
            formulaText.innerText = 'Please enter a valid number';
            return;
        }

        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        
        formulaText.innerText = `Converting...`;
        
        // This is a placeholder display logic. In a real integration,
        // you would call apiClient.getConvertedValue(fromUnit, toUnit, fromVal)
        setTimeout(() => {
            toValueInput.value = (fromVal * 1).toFixed(2); // Example placeholder math
            formulaText.innerText = `Connected. Awaiting endpoint configuration for true mathematical conversions.`;
        }, 150);
    }

    // Event Listeners
    typeBtns.forEach(btn => btn.addEventListener('click', handleTypeChange));
    fromValueInput.addEventListener('input', performConversion);
    fromUnitSelect.addEventListener('change', performConversion);
    toUnitSelect.addEventListener('change', performConversion);

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'index.html';
    });

    // Sub-icon reverse handle
    document.getElementById('swap-btn').addEventListener('click', () => {
        const temp = fromUnitSelect.value;
        fromUnitSelect.value = toUnitSelect.value;
        toUnitSelect.value = temp;
        performConversion();
    });

    // Initialize UI
    loadUnits(currentType);
    performConversion();
});
