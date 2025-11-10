// Initialize Lucide icons on load
document.addEventListener('DOMContentLoaded', () => {
    // The main setup function is called once the DOM is ready
    lucide.createIcons();
    setupControls(); 
});

// --- GLOBAL STATE ---
let ARRAY = [];
let ARRAY_SIZE = 50;
let SPEED = 50;
let COMPARISONS = 0;
let SWAPS = 0;
let IS_SORTING = false;
let ALGORITHM = 'bubble';
let COMPARING_INDICES = [];
let SORTED_INDICES = [];

// --- DOM REFERENCES ---
const $visContainer = document.getElementById('bar-visualization');
const $arraySizeRange = document.getElementById('array-size-range');
const $arraySizeLabel = document.getElementById('array-size-label');
const $speedRange = document.getElementById('speed-range');
const $speedLabel = document.getElementById('speed-label');
const $algoSelect = document.getElementById('algorithm-select');
const $startStopBtn = document.getElementById('start-stop-btn');
const $newArrayBtn = document.getElementById('new-array-btn');
const $compCount = document.getElementById('comparisons-count');
const $swapCount = document.getElementById('swaps-count');
const $algoNameDisplay = document.getElementById('current-algo-name');
const $algoComplexityDisplay = document.getElementById('current-algo-complexity');

const ALGORITHMS = [
    { value: 'bubble', name: 'Bubble Sort', complexity: 'O(n²)', func: bubbleSort },
    { value: 'selection', name: 'Selection Sort', complexity: 'O(n²)', func: selectionSort },
    { value: 'insertion', name: 'Insertion Sort', complexity: 'O(n²)', func: insertionSort },
    { value: 'merge', name: 'Merge Sort', complexity: 'O(n log n)', func: mergeSort },
    { value: 'quick', name: 'Quick Sort', complexity: 'O(n log n)', func: quickSort }
];

// --- UTILITY FUNCTIONS ---

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function generateArray() {
    ARRAY = Array.from({ length: ARRAY_SIZE }, () => 
        Math.floor(Math.random() * 400) + 20
    );
    COMPARISONS = 0;
    SWAPS = 0;
    COMPARING_INDICES = [];
    SORTED_INDICES = [];
    updateStats();
    visualizeArray();
}

function visualizeArray() {
    $visContainer.innerHTML = ''; // Clear previous bars
    
    ARRAY.forEach((value, index) => {
        const bar = document.createElement('div');
        const isComparing = COMPARING_INDICES.includes(index);
        const isSorted = SORTED_INDICES.includes(index);

        let colorClass = 'bg-blue-500'; // Default
        if (isSorted) {
            colorClass = 'bg-green-500';
        } else if (isComparing) {
            colorClass = 'bg-red-500';
        }

        bar.className = `transition-all duration-200 rounded-t ${colorClass}`;
        bar.style.height = `${(value / 420) * 100}%`;
        bar.style.width = `${Math.max(100 / ARRAY_SIZE, 0.5)}%`; // Ensure a minimum width

        $visContainer.appendChild(bar);
    });
}

function updateStats() {
    $compCount.textContent = COMPARISONS;
    $swapCount.textContent = SWAPS;

    const algoInfo = ALGORITHMS.find(a => a.value === ALGORITHM);
    $algoNameDisplay.textContent = algoInfo.name;
    $algoComplexityDisplay.textContent = algoInfo.complexity;

    // Update button state and text
    $startStopBtn.disabled = SORTED_INDICES.length === ARRAY.length && !IS_SORTING;
    $newArrayBtn.disabled = IS_SORTING;
    $arraySizeRange.disabled = IS_SORTING;
    $algoSelect.disabled = IS_SORTING;

    if (IS_SORTING) {
        $startStopBtn.innerHTML = `<i data-lucide="pause" class="w-4 h-4"></i><span>Stop</span>`;
    } else {
        $startStopBtn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i><span>Start</span>`;
    }
    lucide.createIcons(); // Re-render icon
}

// --- SORTING ALGORITHMS ---

async function bubbleSort() {
    const n = ARRAY.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (!IS_SORTING) return;
            
            COMPARING_INDICES = [j, j + 1];
            COMPARISONS++;
            updateStats();
            visualizeArray();
            await sleep(101 - SPEED);

            if (ARRAY[j] > ARRAY[j + 1]) {
                [ARRAY[j], ARRAY[j + 1]] = [ARRAY[j + 1], ARRAY[j]];
                SWAPS++;
                updateStats();
                visualizeArray();
            }
        }
        SORTED_INDICES.push(n - i - 1);
    }
    SORTED_INDICES.push(0);
    COMPARING_INDICES = [];
    visualizeArray();
}

async function selectionSort() {
    const n = ARRAY.length;

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (!IS_SORTING) return;
            
            COMPARING_INDICES = [minIdx, j];
            COMPARISONS++;
            updateStats();
            visualizeArray();
            await sleep(101 - SPEED);

            if (ARRAY[j] < ARRAY[minIdx]) {
                minIdx = j;
            }
        }
        
        if (minIdx !== i) {
            [ARRAY[i], ARRAY[minIdx]] = [ARRAY[minIdx], ARRAY[i]];
            SWAPS++;
            updateStats();
            visualizeArray();
        }
        SORTED_INDICES.push(i);
    }
    SORTED_INDICES.push(n - 1);
    COMPARING_INDICES = [];
    visualizeArray();
}

async function insertionSort() {
    const n = ARRAY.length;

    for (let i = 1; i < n; i++) {
        let key = ARRAY[i];
        let j = i - 1;

        while (j >= 0) {
            if (!IS_SORTING) return;
            
            COMPARING_INDICES = [j, j + 1];
            COMPARISONS++;
            updateStats();
            visualizeArray();
            await sleep(101 - SPEED);

            if (ARRAY[j] > key) {
                ARRAY[j + 1] = ARRAY[j];
                SWAPS++;
                j--;
            } else {
                break;
            }
        }
        ARRAY[j + 1] = key;
        visualizeArray(); // Update after insertion
    }
    SORTED_INDICES = Array.from({ length: n }, (_, i) => i);
    COMPARING_INDICES = [];
    visualizeArray();
}

// Helper function for Merge Sort
async function merge(arr, l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;
    const L = arr.slice(l, m + 1);
    const R = arr.slice(m + 1, r + 1);

    let i = 0, j = 0, k = l;

    while (i < n1 && j < n2) {
        if (!IS_SORTING) return;
        
        COMPARING_INDICES = [l + i, m + 1 + j];
        COMPARISONS++;
        updateStats();
        visualizeArray();
        await sleep(101 - SPEED);

        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
        // Note: Merge sort swaps are implicit data movements
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
    // Update the global array state for visualization
    for (let idx = l; idx <= r; idx++) {
        ARRAY[idx] = arr[idx];
    }
    SWAPS++; // Count one movement per merge step for visualization
    updateStats();
    visualizeArray();
}

async function mergeSort() {
    const tempArray = [...ARRAY]; // Use a copy internally for merges
    
    const mergeSortHelper = async (arr, l, r) => {
        if (!IS_SORTING || l >= r) return;
        
        const m = Math.floor((l + r) / 2);
        await mergeSortHelper(arr, l, m);
        await mergeSortHelper(arr, m + 1, r);
        await merge(arr, l, m, r);

        // Add to sorted indices temporarily for visual feedback of merged section
        for (let i = l; i <= r; i++) {
            if (!SORTED_INDICES.includes(i)) {
                SORTED_INDICES.push(i);
            }
        }
    };

    await mergeSortHelper(tempArray, 0, tempArray.length - 1);
    SORTED_INDICES = Array.from({ length: ARRAY.length }, (_, i) => i);
    COMPARING_INDICES = [];
    visualizeArray();
}

// Helper function for Quick Sort
async function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (!IS_SORTING) return i;
        
        COMPARING_INDICES = [j, high];
        COMPARISONS++;
        updateStats();
        visualizeArray();
        await sleep(101 - SPEED);

        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            SWAPS++;
            // Update global array state after swap
            ARRAY[i] = arr[i];
            ARRAY[j] = arr[j];
            updateStats();
            visualizeArray();
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    SWAPS++;
    // Update global array state after final swap
    ARRAY[i + 1] = arr[i + 1];
    ARRAY[high] = arr[high];
    updateStats();
    visualizeArray();
    return i + 1;
}

async function quickSort() {
    const quickSortHelper = async (arr, low, high) => {
        if (!IS_SORTING || low >= high) {
            if (low === high) SORTED_INDICES.push(low);
            return;
        }
        
        const pi = await partition(arr, low, high);
        if (!IS_SORTING) return;

        SORTED_INDICES.push(pi);
        updateStats(); // Mark pivot as sorted

        await quickSortHelper(arr, low, pi - 1);
        await quickSortHelper(arr, pi + 1, high);
    };
    
    await quickSortHelper(ARRAY, 0, ARRAY.length - 1);
    SORTED_INDICES = Array.from({ length: ARRAY.length }, (_, i) => i);
    COMPARING_INDICES = [];
    visualizeArray();
}


// --- EVENT HANDLERS ---

async function handleSort() {
    if (IS_SORTING) {
        // Stop button functionality
        IS_SORTING = false;
        updateStats();
        return;
    }
    
    // Start button functionality
    IS_SORTING = true;
    COMPARISONS = 0;
    SWAPS = 0;
    SORTED_INDICES = [];
    COMPARING_INDICES = [];
    updateStats();

    const algo = ALGORITHMS.find(a => a.value === ALGORITHM);
    
    try {
        await algo.func();
    } catch (error) {
        console.error("Sorting error:", error);
    } finally {
        // Ensure the sorting flag is reset only if the process completed naturally
        if (IS_SORTING) {
            IS_SORTING = false;
            SORTED_INDICES = Array.from({ length: ARRAY.length }, (_, i) => i);
        }
        COMPARING_INDICES = [];
        updateStats();
        visualizeArray();
    }
}

function handleAlgorithmChange(event) {
    if (IS_SORTING) return;
    ALGORITHM = event.target.value;
    generateArray(); // Generate new array when changing algorithm for a clean start
}

function handleArraySizeChange(event) {
    if (IS_SORTING) return;
    ARRAY_SIZE = parseInt(event.target.value);
    $arraySizeLabel.textContent = `Array Size: ${ARRAY_SIZE}`;
    generateArray();
}

function handleSpeedChange(event) {
    SPEED = parseInt(event.target.value);
    $speedLabel.textContent = `Speed: ${SPEED}`;
}

// --- INITIALIZATION ---

function setupControls() {
    // Populate algorithm selector
    $algoSelect.innerHTML = ALGORITHMS.map(algo => 
        `<option value="${algo.value}" class="bg-slate-800">${algo.name} - ${algo.complexity}</option>`
    ).join('');

    // Set initial algorithm display
    const initialAlgo = ALGORITHMS.find(a => a.value === ALGORITHM);
    if (initialAlgo) {
        $algoNameDisplay.textContent = initialAlgo.name;
        $algoComplexityDisplay.textContent = initialAlgo.complexity;
    }


    // Attach listeners
    $startStopBtn.addEventListener('click', handleSort);
    $newArrayBtn.addEventListener('click', () => {
        if (IS_SORTING) {
            IS_SORTING = false;
            setTimeout(generateArray, 250); // Small delay to allow the stop to fully register
        } else {
            generateArray();
        }
    });
    $arraySizeRange.addEventListener('input', handleArraySizeChange);
    $speedRange.addEventListener('input', handleSpeedChange);
    $algoSelect.addEventListener('change', handleAlgorithmChange);

    // Set initial range values and labels
    $arraySizeRange.value = ARRAY_SIZE;
    $speedRange.value = SPEED;
    $arraySizeLabel.textContent = `Array Size: ${ARRAY_SIZE}`;
    $speedLabel.textContent = `Speed: ${SPEED}`;

    // Initial array generation
    generateArray();
}
