//Call on the autocomplete widget what we are passing is to meet our specific objective for the autocomplete in our project
//Contents that will be the same for both autoComplete calls
const autoCompleteConfig = {
     //define how to render the dropdown content
     renderOption(movie){
        const imgSrc = movie.Poster ==='N/A' ? '' : movie.Poster; //Check if the Poster actually has an image or if its src is NA
        return `
        <img src= "${imgSrc}"/>
        ${movie.Title} (${movie.Year})
        `;
    },
    //define what happens to the text on the input when the user clicks an option
    inputValue(movie){
        return movie.Title;
    },
    async fetchData(searchTerm){
        const response = await axios.get('http://www.omdbapi.com/',
        {
           params: {
               apikey: 'd3fbed20',
               s: searchTerm
           } 
        });
        if(response.data.Error){
            return []; //don't show any content at all
        }
       
        return response.data.Search;
        
    }
}
//Want to call Create Autocomplete twice
createAutoComplete({
    ...autoCompleteConfig, //Destructure the object and pass it
    root: document.querySelector('#left-autocomplete'),
      //define what happens when user selects an option(what to display in this case)
      onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});
createAutoComplete({
    ...autoCompleteConfig, //Destructure the object and pass it
    root: document.querySelector('#right-autocomplete'),
      //define what happens when user selects an option(what to display in this case)
      onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

let leftMovie; //to store details on the right movie selected
let rightMovie; //to store details on the left movie selected

//Helper function to make a followup request after searching for a particular movie
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/',
    {
       params: {
           apikey: 'd3fbed20',
           i: movie.imdbID
       } 
    });

   summaryElement.innerHTML= movieTemplate(response.data); 
   if(side === 'left'){
       leftMovie = response.data;
   }
   else{
       rightMovie = response.data;
   }
   //check if both movies are defined to run comparison
   if(leftMovie && rightMovie){
       runComparison();
   }
};

//Helper function to run comparison

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');
    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];
        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);
        if(rightSideValue > leftSideValue){
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        }else{
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    })
};

//Render the movie information on a specific movie
const movieTemplate = (movieDetail) => {
    //actually parse the response values to numbers for comparison
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    console.log(dollars);
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards = movieDetail.Awards.split(' ').reduce((prev,element) => {
        const value = parseInt(element);
        if (isNaN(value)){
            return prev;
        }else{
            return prev + value;
        }
        
    }, 0);
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};