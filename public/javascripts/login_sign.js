let btn_login = document.getElementsByClassName('btn_login')[0];
let btn_sign = document.getElementsByClassName('btn_sign')[0];

let form_login = document.getElementsByClassName('form_login')[0];
let form_signup = document.getElementsByClassName('form_signup')[0];

let login_signup = document.getElementsByClassName('login_signup ')[0];

let email_login = document.getElementById('email_login');
let password_login = document.getElementById('password_login');


let sign_email = document.getElementById('sign_email');
let sign_password = document.getElementById('sign_password');
let sign_phone = document.getElementById('sign_phone');
let select_role_user = document.getElementById('select_role_user');



let btn_click_login = 1;
let btn_click_sign = 0;



btn_login.addEventListener('click', () => {
    btn_click_login++;
    btn_click_sign = 0;

    clear_placeholder_sign();

    if (btn_click_login >= 2) {
        check_login();
    } else {
        login_signup.classList.remove('active_sign');
        form_login.classList.add('fadein');
        btn_login.classList.add('active_btn');
        btn_sign.classList.remove('active_btn');
        form_signup.style.display = "none";
        setTimeout(() => {
            form_login.style.display = "block";
        }, 100);
    }
    console.log(btn_click_login);

});

btn_sign.addEventListener('click', () => {
    btn_click_login = 0;
    btn_click_sign++;

    clear_placeholder_login();

    if (btn_click_sign >= 2) {
        check_sign();
    } else {
        login_signup.classList.add('active_sign');
        form_signup.classList.add('fadein');

        btn_login.classList.remove('active_btn');
        btn_sign.classList.add('active_btn');
        form_login.style.display = "none";
        setTimeout(() => {
            form_signup.style.display = "block";
        }, 100)
    }

    console.log(btn_click_sign);

});

function check_login() {
    let true_email = false;
    if (!validator_email(email_login.value)) {
        email_login.classList.add('error_placeholder');
        email_login.placeholder = "Не верно указан e-mail";
        email_login.value = '';
    } else {
        email_login.classList.remove('error_placeholder');
        email_login.placeholder = "Введите e-mail";
        true_email = true;
    }
    if (true_email) {
        let data = {
            user_email: email_login.value,
            user_password: password_login.value
        }
        login(data);
    }
}

function clear_placeholder_login() {
    sign_email.classList.remove('error_placeholder');
    sign_email.placeholder = "Введите e-mail";
    email_login.classList.remove('error_placeholder');
    email_login.placeholder = "Введите e-mail";
    password_login.value = '';
    email_login.value = '';
}

function clear_placeholder_sign() {
    password_login.classList.remove('error_placeholder');
    password_login.placeholder = "Введите ваш пароль";
    sign_password.classList.remove('error_placeholder');
    sign_password.placeholder = "Введите ваш пароль";
    sign_phone.classList.remove('error_placeholder');
    sign_phone.placeholder = "Номер телефона";
    sign_email.value = '';
    sign_password.value = '';
    sign_phone.value = '';
}

function check_sign() {
    let sign_email = document.getElementById('sign_email');
    let sign_password = document.getElementById('sign_password');
    let sign_phone = document.getElementById('sign_phone');
    let select_role_user = document.getElementById('select_role_user');

    let isTrue = 3;
    if (!validator_email(sign_email.value)) {
        sign_email.classList.add('error_placeholder');
        sign_email.placeholder = "Не верно указан e-mail";
        sign_email.value = '';
    } else {
        sign_email.classList.remove('error_placeholder');
        sign_email.placeholder = "Введите e-mail";
        isTrue--;
    }

    if (!validator_password(sign_password.value)) {
        sign_password.classList.add('error_placeholder');
        sign_password.placeholder = "Не менее 5 знаков и одна буква";
        sign_password.value = '';
    } else {
        sign_password.classList.remove('error_placeholder');
        sign_password.placeholder = "Введите ваш пароль";
        isTrue--;
    }


    if (!validator_phone(sign_phone.value)) {
        sign_phone.classList.add('error_placeholder');
        sign_phone.placeholder = "Формат телефона 380123456789";
        sign_phone.value = '';
    } else {
        sign_phone.classList.remove('error_placeholder');
        sign_phone.placeholder = "Номер телефона";
        isTrue--;
    }


    let user_role = select_role_user.options[select_role_user.selectedIndex].value;
    if (isTrue == 0) {
        let data = {
            user_email: sign_email.value,
            user_password: sign_password.value,
            user_phone: sign_phone.value,
            user_role: user_role
        }
        sign(data);
    }
}

function validator_phone(str) {
    let re = '^380[0-9]{9}';
    let k = str.match(re);
    return k == null ? false : true;
}

function validator_email(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validator_password(str) {
    let re = '^(?=.*[a-z])(?=.*[0-9])(?=.{6,})';
    let k = str.match(re);
    return k == null ? false : true;
}

async function postData(url = '', data = {}) {

    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    return await response.json();
}



function login(data) {
    postData('/users/login', data)
        .then((res) => {
            // localStorage.setItem('token', res);
            document.cookie = `token=${res}`;
            window.location.href = "/orders"
        });
}

function sign(data) {
    postData('/users/sign', data)
        .then((res) => {
            console.log(res);
        });
}