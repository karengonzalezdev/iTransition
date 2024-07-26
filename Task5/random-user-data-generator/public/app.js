const generateRandomSeed = () => {
    return Math.floor(Math.random() * 1000000);
};

const regionSelect = document.getElementById('region');
const errorSlider = document.getElementById('error-slider');
const errorNumber = document.getElementById('error-number');
const seedInput = document.getElementById('seed');
const randomSeedButton = document.getElementById('random-seed');
const exportCsvButton = document.getElementById('export-csv');
const tableBody = document.querySelector('#user-table tbody');
const loadingIndicator = document.getElementById('loading');
let currentPage = 1;
let totalRecords = 0;
let lastIndex = 0;
const recordsPerPage = 20;
let seedValue = generateRandomSeed();
let isFetching = false;

const fetchData = async () => {
    if (isFetching) return;
    isFetching = true;
    const region = regionSelect.value;
    const errors = errorNumber.value;
    const timestamp = new Date().getTime();
    loadingIndicator.style.display = 'block';
    try {
        const response = await fetch(`/users?region=${region}&errors=${errors}&seed=${seedValue}&page=${currentPage}&recordsPerPage=${currentPage === 1 ? 20 : 10}&t=${timestamp}`);
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        if (currentPage === 1) {
            tableBody.innerHTML = '';
            lastIndex = 0;
            displayedData = [];
        }
        data.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${++lastIndex}</td>
                <td>${user.identifier}</td>
                <td>${user.name}</td>
                <td>${user.address}</td>
                <td>${user.phone}</td>
            `;
            tableBody.appendChild(row);
        });
        displayedData = displayedData.concat(data);
        totalRecords = data.length;
        if (data.length < 10) {
            window.removeEventListener('scroll', handleScroll);
        }
        loadingIndicator.style.display = 'none';
    } catch (error) {
        console.error('Fetch data error:', error);
    } finally {
        isFetching = false;
    }
};

const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && totalRecords >= 10) {
        currentPage++;
        fetchData();
    }
};

const setSeed = (value) => {
    seedValue = value;
    seedInput.value = value;
    currentPage = 1;
    fetchData();
};

regionSelect.addEventListener('change', () => {
    currentPage = 1;
    setSeed(seedValue);
});

errorSlider.addEventListener('input', () => {
    const value = Math.round(parseFloat(errorSlider.value) * 2) / 2;
    errorNumber.value = value;
    currentPage = 1;
    fetchData();
});

errorNumber.addEventListener('input', () => {
    let value = Math.round(parseFloat(errorNumber.value) * 2) / 2;
    value = isNaN(value) ? 0 : Math.max(0, Math.min(value, 1000));
    errorNumber.value = value;
    errorSlider.value = Math.min(value, 10);
    currentPage = 1;
    fetchData();
});

randomSeedButton.addEventListener('click', () => {
    const newSeed = generateRandomSeed();
    setSeed(newSeed);
});

exportCsvButton.addEventListener('click', () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Index,Identifier,Name,Address,Phone\n';
    let globalIndex = 1;
    displayedData.forEach(user => {
        csvContent += `${globalIndex++},${user.identifier},"${user.name}","${user.address}","${user.phone}"\n`;
    });
    if (csvContent.endsWith('\n')) {
        csvContent = csvContent.slice(0, -1);
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'user_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

seedInput.addEventListener('input', () => {
    const value = Math.max(0, parseInt(seedInput.value, 10));
    if (!isNaN(value)) {
        setSeed(value);
    } else if (seedInput.value === '') {
        setSeed(0);
    }
});

window.addEventListener('scroll', handleScroll);

document.addEventListener('DOMContentLoaded', () => {
    seedValue = generateRandomSeed();
    seedInput.value = seedValue;
    fetchData();
});