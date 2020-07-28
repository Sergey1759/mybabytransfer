let send = document.getElementById('send');
let btn_add_img = document.getElementById('btn_add_img');

//btn_add_img

send.addEventListener('click', async () => {
    let formData = new FormData();
    formData.append('avatar', btn_add_img.files[0]);
    await fetch('/users/add_photo', {
        method: 'POST',
        body: formData,
    });
});