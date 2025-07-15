const buttons = document.querySelectorAll('.packages2-button');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const listId = button.id.replace('toggleButton', 'packagesList');
        const list = document.getElementById(listId);

        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        list.classList.toggle('expanded', !isExpanded);

        button.setAttribute('aria-expanded', (!isExpanded).toString());

        button.textContent = isExpanded ? 'Show more' : 'Show less';
    });
});