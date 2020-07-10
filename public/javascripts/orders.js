let info_row = document.getElementsByClassName('info_row');
let row = document.getElementsByClassName('row');

for (const iterator of row) {
    iterator.addEventListener('click', () => {
        let id = 99 + iterator.id;
        let info_row_local = document.getElementById(id);
        if (info_row_local.style.display == 'flex') {
            info_row_local.style.display = 'none';
        } else {
            clear();
            info_row_local.style.display = 'flex';
        }
    })
}

function clear() {
    for (const iterator of info_row) {
        iterator.style.display = 'none';
    }
}