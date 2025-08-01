const fs = require('fs');

// Reading and parsing JSON
const rawData = fs.readFileSync('input.json', 'utf-8');
const jsonData = JSON.parse(rawData);

const n = jsonData.keys.n;
const k = jsonData.keys.k;
const m = k - 1;

let roots = [];

for (const key in jsonData) {
    if (key === 'keys') continue;
    const x = parseInt(key);
    const base = parseInt(jsonData[key].base);
    const value = jsonData[key].value;
    const y = parseInt(value, base);
    roots.push({ x, y });
}

roots = roots.sort((a, b) => a.x - b.x).slice(0, k);

// Constructing matrix and vector
function generateVandermondeMatrix(roots, degree) {
    return roots.map(r => {
        const row = [];
        for (let i = 0; i <= degree; i++) {
            row.push(r.x ** i);
        }
        return row;
    });
}

function extractYVector(roots) {
    return roots.map(r => r.y);
}

//Gaussian Elimination
function gaussianElimination(A, b) {
    const n = A.length;
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
                maxRow = k;
            }
        }

        [A[i], A[maxRow]] = [A[maxRow], A[i]];
        [b[i], b[maxRow]] = [b[maxRow], b[i]];

        for (let k = i + 1; k < n; k++) {
            const factor = A[k][i] / A[i][i];
            for (let j = i; j < n; j++) {
                A[k][j] -= factor * A[i][j];
            }
            b[k] -= factor * b[i];
        }
    }

    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = b[i];
        for (let j = i + 1; j < n; j++) {
            x[i] -= A[i][j] * x[j];
        }
        x[i] /= A[i][i];
    }

    return x;
}

// Solve system and output constant term 
const A = generateVandermondeMatrix(roots, m);
const b = extractYVector(roots);
const coefficients = gaussianElimination(A, b);

console.log(`Constant term (a₀): ${Math.round(coefficients[0])}`);
