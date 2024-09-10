document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    const searchInput = document.getElementById('search');
    const resultsPerPageSelect = document.getElementById('results-per-page');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');
    const spinner = document.getElementById('spinner');
    const pagination = document.getElementById('pagination');

    let data = [];
    let rowsPerPage = parseInt(resultsPerPageSelect.value);
    let currentPage = 1;

    function fetchData(query) {
        spinner.style.display = 'block';
    
        fetch(`/api/cities?query=${query}`)
            .then(response => response.json())
            .then(responseData => {
                console.log('Data fetched:', responseData);
                spinner.style.display = 'none';
                data = responseData.data || []; 
                console.log('Data assigned to variable:', data);
                renderTable(); 
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                spinner.style.display = 'none';
            });
    }        

    function renderTable() {
        const tableBody = document.getElementById('table-body');
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = data.slice(start, end);
    
        console.log('Paginated Data:', paginatedData);
    
        tableBody.innerHTML = '';
    
        if (paginatedData.length === 0) {
            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="3" class="placeholder">No result found</td></tr>';
            } else {
                tableBody.innerHTML = '<tr><td colspan="3" class="placeholder">Start searching</td></tr>';
            }
            pagination.style.display = 'none';
            return;
        }
    
        paginatedData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${start + index + 1}</td>
                <td>${item.city}</td>
                <td><img src="https://flagsapi.com/${item.countryCode}/flat/32.png" alt="${item.countryCode}" /></td>
            `;
            tableBody.appendChild(row);
        });
    
        pageInfo.textContent = `Page ${currentPage}`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = end >= data.length;
        pagination.style.display = data.length > rowsPerPage ? 'flex' : 'none';
    }
    
    

    searchInput.addEventListener('input', () => {
        currentPage = 1;
        fetchData(searchInput.value);
    });

    resultsPerPageSelect.addEventListener('change', () => {
        rowsPerPage = parseInt(resultsPerPageSelect.value);
        currentPage = 1;
        fetchData(searchInput.value);
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage * rowsPerPage < data.length) {
            currentPage++;
            renderTable();
        }
    });

    
    fetchData('');
});