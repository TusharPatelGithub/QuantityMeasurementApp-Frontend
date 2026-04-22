document.addEventListener('DOMContentLoaded', () => {
    // Authentication Check
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // Units configuration
    const units = {
        length: ['Feet', 'Inch', 'Yards', 'Centimeters'],
        volume: ['Litre', 'Millilitre', 'Gallon'],
        weight: ['Kilogram', 'Gram', 'Pound'],
        temperature: ['Celsius', 'Fahrenheit', 'Kelvin']
    };

    // DOM Elements
    const typeBtns     = document.querySelectorAll('.type-btn');
    const opBtns       = document.querySelectorAll('.op-btn');
    const fromUnitSel  = document.getElementById('from-unit');
    const toUnitSel    = document.getElementById('to-unit');
    const fromValueIn  = document.getElementById('from-value');
    const toValueIn    = document.getElementById('to-value');
    const logoutBtn    = document.getElementById('logout-btn');
    const formulaText  = document.getElementById('formula-text');
    const labelFrom    = document.getElementById('label-from');
    const labelTo      = document.getElementById('label-to');

    let currentType      = 'length';
    let currentOperation = 'CONVERT';

    // ── Load Units ────────────────────────────────────────────────────────────
    function loadUnits(type) {
        fromUnitSel.innerHTML = '';
        toUnitSel.innerHTML   = '';
        units[type].forEach(u => {
            fromUnitSel.innerHTML += `<option value="${u}">${u}</option>`;
            toUnitSel.innerHTML   += `<option value="${u}">${u}</option>`;
        });
        if (units[type].length > 1) {
            fromUnitSel.selectedIndex = 0;
            toUnitSel.selectedIndex   = 1;
        }
    }

    // ── UI: update labels & readonly based on operation ───────────────────────
    function applyOperationUi() {
        if (currentOperation === 'CONVERT') {
            labelFrom.textContent  = 'From';
            labelTo.textContent    = 'To';
            toValueIn.readOnly     = true;
            toValueIn.value        = '';
            toValueIn.style.backgroundColor = '';
            toValueIn.style.cursor = 'default';
        } else {
            labelFrom.textContent  = 'First Quantity';
            labelTo.textContent    = 'Second Quantity';
            toValueIn.readOnly     = false;
            toValueIn.value        = toValueIn.value || '1';
            toValueIn.style.backgroundColor = '#fff';
            toValueIn.style.cursor = 'text';
        }
        formulaText.innerText = '—';
    }

    // ── Core: perform the selected operation ──────────────────────────────────
    async function performOperation() {
        const fromVal  = parseFloat(fromValueIn.value);
        const fromUnit = fromUnitSel.value;
        const toUnit   = toUnitSel.value;

        if (isNaN(fromVal)) {
            formulaText.innerText = 'Enter a valid number';
            return;
        }

        if (currentOperation !== 'CONVERT') {
            const toVal = parseFloat(toValueIn.value);
            if (isNaN(toVal)) {
                formulaText.innerText = 'Enter a valid second quantity';
                return;
            }
        }

        formulaText.innerText = 'Calculating…';

        try {
            if (currentOperation === 'CONVERT') {
                const data = await apiClient.convert(fromVal, fromUnit, currentType, toUnit);
                if (data && data.result !== undefined) {
                    toValueIn.value       = data.result.toFixed(2);
                    formulaText.innerText = `${fromVal} ${fromUnit} = ${data.result.toFixed(4)} ${toUnit}`;
                }

            } else if (currentOperation === 'COMPARE') {
                const toVal = parseFloat(toValueIn.value);
                const data  = await apiClient.compare(fromVal, fromUnit, toVal, toUnit, currentType);
                const equal = data.result === 1;
                formulaText.innerText = equal
                    ? `✅ ${fromVal} ${fromUnit} is EQUAL to ${toVal} ${toUnit}`
                    : `❌ ${fromVal} ${fromUnit} is NOT EQUAL to ${toVal} ${toUnit}`;

            } else if (currentOperation === 'ADD') {
                const toVal = parseFloat(toValueIn.value);
                const data  = await apiClient.add(fromVal, fromUnit, toVal, toUnit, currentType);
                formulaText.innerText = `${fromVal} ${fromUnit} + ${toVal} ${toUnit} = ${data.result} ${data.unit}`;

            } else if (currentOperation === 'SUBTRACT') {
                const toVal = parseFloat(toValueIn.value);
                const data  = await apiClient.subtract(fromVal, fromUnit, toVal, toUnit, currentType);
                formulaText.innerText = `${fromVal} ${fromUnit} − ${toVal} ${toUnit} = ${data.result} ${data.unit}`;

            } else if (currentOperation === 'DIVIDE') {
                const toVal = parseFloat(toValueIn.value);
                const data  = await apiClient.divide(fromVal, fromUnit, toVal, toUnit, currentType);
                formulaText.innerText = `${fromVal} ${fromUnit} ÷ ${toVal} ${toUnit} = ${data.result}`;
            }

        } catch (error) {
            console.error('Operation error:', error);
            formulaText.innerText = error.message || 'Operation failed.';
        }
    }

    // ── Event Listeners ───────────────────────────────────────────────────────

    // Measurement type change
    typeBtns.forEach(btn => btn.addEventListener('click', (e) => {
        typeBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentType = e.currentTarget.getAttribute('data-type');
        loadUnits(currentType);
        performOperation();
    }));

    // Operation change
    opBtns.forEach(btn => btn.addEventListener('click', (e) => {
        opBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentOperation = e.currentTarget.getAttribute('data-op');
        applyOperationUi();
        performOperation();
    }));

    // Inputs
    fromValueIn.addEventListener('input',  performOperation);
    toValueIn.addEventListener('input',    performOperation);
    fromUnitSel.addEventListener('change', performOperation);
    toUnitSel.addEventListener('change',   performOperation);

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'index.html';
    });

    // Swap button
    document.getElementById('swap-btn').addEventListener('click', () => {
        const tempUnit = fromUnitSel.value;
        fromUnitSel.value = toUnitSel.value;
        toUnitSel.value   = tempUnit;

        if (currentOperation !== 'CONVERT') {
            const tempVal      = fromValueIn.value;
            fromValueIn.value  = toValueIn.value;
            toValueIn.value    = tempVal;
        }
        performOperation();
    });

    // ── Init ─────────────────────────────────────────────────────────────────
    loadUnits(currentType);
    applyOperationUi();
    performOperation();
});
