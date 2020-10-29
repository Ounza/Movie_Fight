//Autocomplete widget 
//The config/root object - where we put our references to movies
const createAutoComplete = ({root ,renderOption, onOptionSelect, inputValue, fetchData}) => {
 
root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
    `;
const input = root.querySelector('input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results');
const onInput = async event =>{
    const items = await fetchData(event.target.value);
    if(!items.length){
        dropdown.classList.remove('is-active');
        return;
    }
    resultsWrapper.innerHTML = ''; //to clear any previous content of a previous search
    dropdown.classList.add('is-active'); //Make the dropdown class active according to Burma CSS
    for (let item of items) {
        //make an anchor tag for the dropdown content. Its not a div
        const option = document.createElement('a');
        
        option.classList.add('dropdown-item'); //the dropdown items should have the dropdown-item class so it is styled by Burma
        option.innerHTML = renderOption(item); //Call the render option with the movie we are currently iterating over
        option.addEventListener('click', () => {
            dropdown.classList.remove('is-active');
            input.value = inputValue(item);
            onOptionSelect(item);
        });
        resultsWrapper.appendChild(option);
    }
};
input.addEventListener('input', debounce(onInput, 500));
//global click event whereby event.target returns the html element clicked
document.addEventListener('click', event => {
    //if what you have clicked is not inside the root(our dropdown)
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active'); //close the dropdown
    }
});
}