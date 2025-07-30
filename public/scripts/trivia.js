document.addEventListener('DOMContentLoaded', () => {
    fetch('https://opentdb.com/api_category.php')
        .then(r => r.json())
        .then(({ trivia_categories }) => {
            const select = document.getElementById('category');
            trivia_categories.forEach(cat => {
                select.insertAdjacentHTML(
                    'beforeend',
                    `<option value="${cat.id}">${cat.name}</option>`
                );
            });
        })
        .catch(err => console.error('Could not load categories:', err));
});