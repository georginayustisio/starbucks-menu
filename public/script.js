document.getElementById('drinkForm').addEventListener('submit', async event => {
    event.preventDefault();
    const type = document.getElementById('type').value;

    const response = await fetch(`/drinks?type=${type}`);
    const drinks = await response.json();

    const results = document.getElementById('results');
    results.innerHTML = drinks.map(drink => `<p>${drink.name}: ${drink.catchcopy}</p>`).join('');
});
