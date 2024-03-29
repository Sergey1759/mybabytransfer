//  ---------------------------     fields 
let date = document.getElementById('date');
let side_by_side = document.getElementById('side_by_side');
let error_date = document.getElementById('error_date');
let el_autocomplete = document.getElementById('autocomplete');
let el_autocomplete2 = document.getElementById('autocomplete2');
let type_error = document.getElementById('type_error');
let child_error = document.getElementById('child_error');

let text_comment = document.getElementById('text_comment');
let Filing_Address, Shipping_Address;
let radio_types_car = document.getElementsByName('type_car');

let create_order = document.getElementById('create_order'); // btn for post

let left_child = document.getElementsByClassName('left_child')[0];
let btn_add_child = document.getElementsByClassName('btn_add_child')[0];

//left_child btn_add_child

let html = `
<div class="selects_child_age_container">
                            <select name="" class="select_years" id="select_years">
                                <option value="0"></option>
                                <option value="1">1 лет</option>
                                <option value="2">2 лет</option>
                                <option value="3">3 лет</option>
                                <option value="4">4 лет</option>
                                <option value="5">5 лет</option>
                                <option value="6">6 лет</option>
                                <option value="7">7 лет</option>
                                <option value="8">8 лет</option>
                                <option value="9">9 лет</option>
                                <option value="10">10 лет</option>
                                <option value="11">11 лет</option>
                                <option value="12">12 лет</option>
                            </select>
                            <select name="" class="select_month" id="select_month">
                                <option value="0"></option>
                                <option value="4">1 мес</option>
                                <option value="4">2 мес</option>
                                <option value="4">3 мес</option>
                                <option value="4">4 мес</option>
                                <option value="4">5 мес</option>
                                <option value="4">6 мес</option>
                                <option value="4">7 мес</option>
                                <option value="4">8 мес</option>
                                <option value="4">9 мес</option>
                                <option value="4">10 мес</option>
                                <option value="4">11 мес</option>
                            </select>
                            <img src="../images/calendar.svg" alt="">
                        </div>
                        <img src="../images/cancel_child.svg" alt="" srcset="" class="delete_child">
`;


function update_remove() {
    let delete_child = document.getElementsByClassName('delete_child');
    for (const iterator of delete_child) {
        iterator.addEventListener('click', () => {
            left_child.removeChild(iterator.parentElement);
        })
    }
}

btn_add_child.addEventListener('click', () => {
    let div = document.createElement('div');
    div.classList.add('selects_child_age');
    div.innerHTML = html;
    left_child.appendChild(div);
    update_remove()
});

create_order.addEventListener('click', async () => {

    let oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    if (!date.value || new Date(date.value) < new Date() || new Date(date.value) > oneMonthFromNow) {
        error_date.innerText = "Некорректная дата";
        date.value = '';
        scrollToElement(date);
        return
    } else {
        error_date.innerText = '';
    }

    console.log(Filing_Address);
    if (!Filing_Address) {
        scrollToElement(el_autocomplete);
        el_autocomplete.placeholder = 'Укажите адрес';
        el_autocomplete.classList.add('input_error');
        return
    } else {
        el_autocomplete.placeholder = 'Выберите адрес';
        el_autocomplete.classList.remove('input_error');
    }

    if (!Shipping_Address) {
        scrollToElement(el_autocomplete2);
        el_autocomplete2.placeholder = 'Укажите адрес';
        el_autocomplete2.classList.add('input_error');
        return
    } else {
        el_autocomplete2.placeholder = 'Выберите адрес';
        el_autocomplete2.classList.remove('input_error');
    }


    let type_auto = getCheckedInput();
    if (type_auto.error) {
        type_error.innerText = type_auto.error;
        return
    } else {
        type_error.innerText = "";
    }

    let babies = getObjectChildYears();
    if (babies.error) {
        child_error.innerText = babies.error;
        return
    } else {
        child_error.innerText = "";
    }
    console.log(Filing_Address);
    let data = {
        date: new Date(date.value),
        city: Filing_Address.address_components[2].long_name,
        Filing_Address: Filing_Address.formatted_address,
        Shipping_Address: Shipping_Address.formatted_address,
        type_auto: type_auto,
        babies: babies,
        round_trip: side_by_side.checked,
        comment: text_comment.value,
    }
    console.log(babies);
    await postData('/orders/create', data).then(res => {
        console.log(res);
        location.replace(`/orders/confirm_order/${res.order}`)
    });
});

function getCheckedInput() {
    let buf;
    let isValid = false;
    for (const iterator of radio_types_car) {
        if (iterator.checked == true) {
            buf = iterator.value;
            isValid = true;
        }
    }
    return isValid ? buf : {
        error: "Выберите тип автомобиля"
    };
}

function getObjectChildYears() {
    let selects = document.getElementsByClassName('selects_child_age_container');
    let arr = [];
    for (const iterator of selects) {
        let local_select_years = iterator.querySelector('#select_years');
        console.log(local_select_years);
        let buf_years = getSelected(local_select_years);
        let local_select_month = iterator.querySelector('#select_month');
        let buf_month = getSelected(local_select_month);
        arr.push({
            years: buf_years,
            month: buf_month
        })
    }
    return arr.length > 0 ? arr : {
        error: 'нет выбранных детей'
    };
}

function getSelected(el) {
    return el.options[el.selectedIndex].value
}

function scrollToElement(el) {
    window.scrollTo({
        top: el.getBoundingClientRect().top,
        behavior: "smooth"
    });
};