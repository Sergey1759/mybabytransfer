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

let message_btn = document.getElementById('message_btn');
let message = document.getElementsByClassName('message')[0];

let btn_click_login = 1;
let btn_click_sign = 0;

let audio = new Audio('../sound/hollow.mp3');

let now = 'login';

message_btn.addEventListener('click', () => {
    message.classList.add('message_out');
    setTimeout(() => {
        message.style.display = "none";
    }, 1000);
});

btn_login.addEventListener('click', () => {
    btn_click_login++;
    btn_click_sign = 0;
    now = 'login';
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
    now = 'sign';
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
        create_tooltip(email_login, 'Не верно указан e-mail');
    } else {
        true_email = true;
    }
    if (password_login.value.length == 0) {
        create_tooltip(password_login, 'Поле не должно быть пустым');
        return
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
    reset_tooltip()
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
    reset_tooltip()
}

async function check_sign() {
    let sign_email = document.getElementById('sign_email');
    let sign_password = document.getElementById('sign_password');
    let confirm_password = document.getElementById('confirm_password');
    let sign_phone = document.getElementById('sign_phone');
    let select_role_user = document.getElementById('select_role_user');

    let isTrue = 4;
    if (!validator_email(sign_email.value)) {
        create_tooltip(sign_email, "Не верно указан e-mail");
    } else {
        isTrue--;
    }

    if (!validator_password(sign_password.value)) {
        create_tooltip(sign_password, "Не менее 5 знаков и одна буква");
    } else {
        isTrue--;
    }


    if (!validator_phone(sign_phone.value)) {
        create_tooltip(sign_phone, "Формат телефона 380123456789");
    } else {
        isTrue--;
    }

    if (confirm_password.value != sign_password.value || confirm_password.value == '') {
        create_tooltip(confirm_password, "Пароли не совпадают");
    } else {
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
        let res = await sign(data);

        if (res.error) {
            sign_email.classList.add('error_placeholder');
            create_tooltip(sign_email, res.error);
        }
        if (res.confirm) {
            message.style.display = "flex";
            message.classList.add('anim_message');
            audio.play();
        }
    }
}

document.addEventListener('keypress', (event) => {
    const keyName = event.key;
    let obj = {
        'sign': check_sign,
        'login': check_login,
    }
    if (keyName == 'Enter') {
        obj[now]();
    }
});

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



async function login(data) {
    await postData('/users/login', data)
        .then(async (res) => {
            // localStorage.setItem('token', res);
            if (res.er) {
                create_tooltip(email_login, res.er);
                create_tooltip(password_login, res.er);
            }
            if (res.token) {
                document.cookie = `token=${res.token};`;
                console.log(res.token) //document.cookie
                console.log(document.cookie) //document.cookie
                window.location.href = "/orders/page/1";
            }
        });
}

async function sign(data) {
    return postData('/users/sign', data)
        .then((res) => {
            return res;
        });
}