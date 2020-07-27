function create_tooltip(element, text) {
    element.parentElement.style.position = 'relative';
    let parent = element.parentElement;
    let _tooltip = tooltip(text);
    parent.appendChild(_tooltip);
    let anim_el = parent.querySelector('.tooltip');
    let anim_input = parent.querySelector('input');
    anim_el.classList.add('fade_in');
    anim_el.style.display = 'block';
    anim_input.addEventListener('focus', () => {
        anim_el.classList.add('fade_out');
        setTimeout(() => {
            parent.removeChild(anim_el);
        }, 500)
    });
}

function tooltip(text) {
    let tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.innerText = text;
    tooltip.style.display = 'none';
    return tooltip;
}

function reset_tooltip() {
    let tooltip = document.querySelectorAll('.tooltip');
    for (const iterator of tooltip) {
        iterator.parentElement.removeChild(iterator);
    }
}