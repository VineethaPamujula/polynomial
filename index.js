const fs = require('fs');

// Function to decode the value from a given base to decimal
function decodeValue(base, value) {
    return parseInt(value, base);
}

// Function to perform Gaussian elimination
function gaussianElimination(matrix, n) {
    for (let i = 0; i < n; i++) {
        // Make the pivot 1
        for (let j = i + 1; j < n; j++) {
            const factor = matrix[j][i] / matrix[i][i];
            for (let k = i; k <= n; k++) {
                matrix[j][k] -= factor * matrix[i][k];
            }
        }
    }

    // Back substitution
    const coefficients = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        coefficients[i] = matrix[i][n] / matrix[i][i];
        for (let j = i + 1; j < n; j++) {
            coefficients[i] -= (matrix[i][j] / matrix[i][i]) * coefficients[j];
        }
    }
    return coefficients;
}

function findConstantTerm(fileName) {
    const data = fs.readFileSync(fileName, 'utf8');
    const jsonData = JSON.parse(data);

    const n = jsonData.keys.n;
    const k = jsonData.keys.k;

    const points = [];
    for (const [key, obj] of Object.entries(jsonData)) {
        if (key === "keys") continue;
        const x = parseInt(key, 10);
        const y = decodeValue(parseInt(obj.base, 10), obj.value);
        points.push([x, y]);
    }

    if (points.length < k) {
        throw new Error(`Not enough points to solve the polynomial. Minimum required is ${k}, but got ${points.length}`);
    }

    // Create Vandermonde matrix
    const matrix = Array(k).fill(0).map(() => Array(k + 1).fill(0));
    for (let i = 0; i < k; i++) {
        const x = points[i][0];
        const y = points[i][1];
        for (let j = 0; j < k; j++) {
            matrix[i][j] = Math.pow(x, j); // Fill the Vandermonde matrix
        }
        matrix[i][k] = y; // Last column is the y value
    }

    // Perform Gaussian elimination to solve for coefficients
    const coefficients = gaussianElimination(matrix, k);

    // Return the constant term (first coefficient)
    return Math.round(coefficients[0]);
}

function main() {
    try {
        const secret1 = findConstantTerm('input.json');
        console.log('Secret value for Test Case 1:', secret1);

        const secret2 = findConstantTerm('input1.json');
        console.log('Secret for Test Case 2:', secret2);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
