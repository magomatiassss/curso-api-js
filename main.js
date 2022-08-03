
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    params: {
       'api_key':  '73d4dfbb2d44ee6896ae961bba680a08',
       'language': 'es'
    }
});

// llamados a la api

function createMovies(movies,container) {
    container.innerHTML = "";
    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        const image = document.createElement('img');
        image.classList.add('movie-img');
        image.setAttribute('alt', movie.title);
        image.setAttribute('src', 
        `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
        
        
        movieContainer.addEventListener('click',() => 
        location.hash = '#movie=' + movie.id)

        movieContainer.appendChild(image);
        container.append(movieContainer);
        

    })
}

function createCategories(categories, container) {
    container.innerHTML = "";
  
    categories.forEach(category => {  
      const categoryContainer = document.createElement('div');
      categoryContainer.classList.add('category-container');
  
      const categoryTitle = document.createElement('h3');
      categoryTitle.classList.add('category-title');
      categoryTitle.setAttribute('id', 'id' + category.id);
      categoryTitle.addEventListener('click', () => {
        location.hash = `#category=${category.id}-${category.name}`;
      });
      const categoryTitleText = document.createTextNode(category.name);
  
      categoryTitle.appendChild(categoryTitleText);
      categoryContainer.appendChild(categoryTitle);
      container.appendChild(categoryContainer);
    });
  }
async function getTrendingMoviesPreview() {
    const {data} = await api('trending/movie/day');
    const movies = data.results;
    createMovies(movies,trendingMoviesPreviewList);
 
}

async function getCategoriesMoviesPreview() {
    const {data} = await api('genre/movie/list');
    const categories = data.genres
   

  createCategories(categories, categoriesPreviewList)  ;
}

async function getTrendingMovies() {
    const {data} = await api('trending/movie/day');
    const movies = data.results;
    createMovies(movies,genericSection);
 
}

async function getMovieById(id) {
    const {data: movie} = await api(`movie/${id}`);

    const movieImgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${movieImgUrl})`
    movieDetailTitle.textContent = movie.title;
    movieDetailScore.textContent = movie.vote_average;
    movieDetailDescription.textContent = movie.overview;

    createCategories(movie.genres, movieDetailCategoriesList)
}


async function getRelatedMoviesId(id) {
    const {data: movie} = await api(`movie/${id}/recommendations`);
    const result = movie.results;
    relatedMoviesContainer.innerHTML=""
       createMovies(result,relatedMoviesContainer)
       relatedMoviesContainer.scrollTo(0, 0);
}

