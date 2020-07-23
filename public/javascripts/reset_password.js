let email = document.getElementById('email');
let password = document.getElementById('password');
let confirm_password = document.getElementById('confirm_password');
let post = document.getElementById('post');

let message_btn = document.getElementById('message_btn');
let message = document.getElementsByClassName('message')[0];
let message_text = document.getElementsByClassName('message_text')[0];
let audio = new Audio('../sound/hollow.mp3');


message_btn.addEventListener('click', () => {
    message.classList.add('message_out');
    setTimeout(() => {
        message.style.display = "none";
    }, 1000);
});

post.addEventListener('click', async () => {
    let isTrue = 3;
    if (!validator_email(email.value)) {
        email.classList.add('error_placeholder');
        email.placeholder = "Не верно указан e-mail";
        email.value = '';
    } else {
        email.classList.remove('error_placeholder');
        email.placeholder = "Введите e-mail";
        isTrue--;
    }

    if (!validator_password(password.value)) {
        password.classList.add('error_placeholder');
        password.placeholder = "Не менее 5 знаков и одна буква";
        password.value = '';
    } else {
        password.classList.remove('error_placeholder');
        password.placeholder = "Введите ваш пароль";
        isTrue--;
    }

    if (confirm_password.value != password.value) {
        confirm_password.classList.add('error_placeholder');
        confirm_password.placeholder = "Пароли не совпадают";
        confirm_password.value = '';
    } else {
        confirm_password.classList.remove('error_placeholder');
        confirm_password.placeholder = "Повторите пароль";
        isTrue--;
    }
    let email_ = {
        email: email.value
    }
    console.log(isTrue);
    if (isTrue == 0) {
        let res = await postData('/users/confirm_email', email_);
        if (res.error) {
            email.classList.add('error_placeholder');
            email.placeholder = res.error;
            email.value = '';
        } else if (res.ok) {
            let data = {
                email: email.value,
                user_password: password.value
            }
            let pass = await postData('/users/confirm_password', data);

            if (pass.ok) {
                message.style.display = "flex";
                message.classList.add('anim_message');
                message_text.innerText = pass.ok;
                audio.play();
            } else if (pass.error) {
                message.style.display = "flex";
                message.classList.add('anim_message');
                message_text.innerText = pass.error;
                audio.play();
            }
            console.log(pass);
        }
    }
});

function validator_email(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validator_password(str) {
    let re = '^(?=.*[a-z])(?=.*[0-9])(?=.{6,})';
    let k = str.match(re);
    return k == null ? false : true;
}