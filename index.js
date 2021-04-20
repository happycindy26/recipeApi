const fetchData = async (searchTerm) => {
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
            apiKey: 'eb273631345644fdb0b98c96d858fa4b',
            query: searchTerm
            
        }
    });
    return response.data.results;
}

const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <label><b>Search a Recipe</b></label>
    <input class="input" />
    <div class="dropdown"> 
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;
const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const onInput = async event => {
    const recipes = await fetchData(event.target.value);
    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');
    for (let recipe of recipes) {
        const option = document.createElement('a');
        option.classList.add('dropdown-item');
        option.innerHTML = `
            <img src="${recipe.image}" />
            <h1>${recipe.title}</h1>
        `;
        option.addEventListener('click', () => {
            dropdown.classList.remove('is-active');
            input.value = recipe.title;
            onRecipeSelect(recipe);
        })
        resultsWrapper.appendChild(option);
    };
};
input.addEventListener('input', debounce(onInput, 500));


document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
});

const onRecipeSelect = async recipe => {
    const response = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, {
        params: {
            apiKey: 'eb273631345644fdb0b98c96d858fa4b',
            includeNutrition: true
        }
    });
    //console.log(response.data);
    //console.log(response.data.instructions);
    ;

    document.querySelector('#summary').innerHTML =
    `
    <div class="img">
        <div>
            <h1 class="title">${response.data.title}</h1>
            <img src="${response.data.image}" alt="Placeholder image">
        </div>
        <div>
            <h1 class="title">Ingredients:</h1>
            <ul></ul>
        </div>     
    </div>
    <div class="summary">
        <p>${response.data.summary}</p>
    </div>
    <div>
        <h1 class="title">Instructions</h1>
        <p>${response.data.instructions}</p>
    </div>
    `
    const ul = document.querySelector('ul');
    for (let ingredient of response.data.extendedIngredients) {
        const ingredients = document.createElement('li');
        ingredients.innerHTML = `
        <li>${ingredient.name}</li>
        `
        ul.appendChild(ingredients);
    }
};

