let exit = document.getElementById('exit');

exit.addEventListener('click', async () => {
    await fetch('/users/logout', {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        redirect: 'follow'
    });
    location.reload();
});