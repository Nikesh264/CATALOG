const fs = require("fs");

// Gaussian Elimination Function
function gaussianElimination(matrix) {
    const n = matrix.length;

    // Forward Elimination
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) {
                maxRow = k;
            }
        }
        // Swap the current row with the row of max element
        const temp = matrix[i];
        matrix[i] = matrix[maxRow];
        matrix[maxRow] = temp;

        // Eliminate the elements below the pivot
        for (let k = i + 1; k < n; k++) {
            const factor = matrix[k][i] / matrix[i][i];
            for (let j = i; j <= n; j++) {
                matrix[k][j] -= factor * matrix[i][j];
            }
        }
    }

    // Back Substitution
    const result = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        result[i] = matrix[i][n] / matrix[i][i];
        for (let k = i - 1; k >= 0; k--) {
            matrix[k][n] -= matrix[k][i] * result[i];
        }
    }

    return result;
}

// Function to Parse JSON and Decode Values
function parseTestCase(testCase) {
    const { keys, roots } = testCase;
    const points = [];
    const degree = keys.n - 1;  // Polynomial degree

    // Loop through the roots and convert the values
    Object.entries(roots).forEach(([x, { base, value }]) => {
        const xVal = parseInt(x, 10);  // Convert x from string to integer
        const yVal = parseInt(value, parseInt(base, 10)); // Decode y value using the base
        points.push([xVal, yVal]);
    });

    return points;
}

// Function to find the constant term for polynomial equations
function findConstantTerm(points) {
    const n = points.length;
    const degree = n - 1;
    const matrix = [];

    points.forEach(([x, y]) => {
        const row = [];
        for (let i = degree; i >= 0; i--) {
            row.push(Math.pow(x, i));
        }
        row.push(y);  // Append the y-value as the last column in the matrix
        matrix.push(row);
    });

    const coefficients = gaussianElimination(matrix);  // Perform Gaussian Elimination to find coefficients
    return coefficients[coefficients.length - 1];  // Return the constant term (last element)
}

// Main Function
function main() {
    const testCases = JSON.parse(fs.readFileSync("testcases.json", "utf8")); // Read the JSON file
    testCases.forEach((testCase, index) => {
        const points = parseTestCase(testCase);  // Parse the test case to get points
        const constantTerm = findConstantTerm(points);  // Find the constant term for the test case
        console.log(`Test Case ${index + 1}: Constant Term = ${constantTerm}`);
    });
}


main();
