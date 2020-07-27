let info_row = document.getElementsByClassName('info_row');
let row = document.getElementsByClassName('row');

let buf = 2;
let open_item = [];
for (const iterator of row) {
    iterator.addEventListener('click', () => {
        let id = 99 + iterator.id;
        let info_row_local = document.getElementById(id);
        if (info_row_local.style.display == 'flex') {
            open_item[0].classList.add('animation_order_reverse');
            setTimeout(() => {
                open_item[0].style.display = 'none';
                open_item[0].classList.remove('animation_order_reverse');
                open_item.splice(0, 1);
            }, 500);
            buf = 2;
        } else {
            buf--;
            open_item.push(info_row_local);

            if (buf <= 0) {
                open_item[0].classList.add('animation_order_reverse');
                console.log(open_item[0]);
                setTimeout(() => {
                    console.log(open_item[0]);
                    open_item[0].style.display = 'none';
                    open_item[0].classList.remove('animation_order_reverse');
                    open_item.splice(0, 1);
                }, 500);
            }
            info_row_local.style.display = 'flex';
            info_row_local.classList.add('animation_order');
            console.log(info_row_local);
            setTimeout(() => {
                info_row_local.classList.remove('animation_order');
            }, 500)
        }
    })
}

// setTimeout(() => {
//     location.reload();
// }, 10000);

function clear_reverse() {
    for (const iterator of info_row) {
        iterator.classList.remove('animation_order_reverse');
    }
}