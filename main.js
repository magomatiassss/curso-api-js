//Data
let lang;
language.addEventListener('change', () => {

    localStorage.setItem('lenguage', language.value);
    location.reload()
})


let api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {

        'content-type': 'application/json; charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
        'language': localStorage.getItem('lenguage')
    }
});




function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if (item) {
        movies = item;
    } else {
        movies = {}
    }

    return movies
}

function likeMovie(movie) {
    const likedMovies = likedMoviesList();
    if (likedMovies[movie.id]) {

        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }
    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
    if (location.hash == '') {
        homePage();
    }
}


// utils
function callback(entries) {
    
        entries.forEach((entry) => {
    
            
            if (entry.isIntersecting === true) {
                const url = entry.target.getAttribute('data-img')
                entry.target.setAttribute('src', url)
            }
    
        })
    }


const lazyLoader = new IntersectionObserver(callback,{threshold: .20});


function createMovies(movies, container, { lazyload = false, clean = true } = {}) {
    if (clean) {
        container.innerHTML = ""
    };

    movies.forEach(movie => {
        

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const image = document.createElement('img');
        image.classList.add('movie-img');
        image.setAttribute('alt', movie.title);
        image.setAttribute(lazyload ? 'data-img' : 'src',
            `https://image.tmdb.org/t/p/original${movie.poster_path}`);

        image.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id
        });

        image.addEventListener('error', () => {
            movieContainer.remove();

            // image.setAttribute(
            //   'src',
            //   'https://static.platzi.com/static/images/error/img404.png',
            // );
        });

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked')
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked')
            likeMovie(movie)
        })

        if (lazyload) {
            lazyLoader.observe(image)
        }

        movieContainer.appendChild(image);
        movieContainer.appendChild(movieBtn);

        container.appendChild(movieContainer);


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



// llamados a la api


async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/week');
    const movies = data.results;
    createMovies(movies, trendingMoviesPreviewList, { lazyload: true });

}


async function getCategoriesMoviesPreview() {
    const { data } = await api('genre/movie/list');
    const categories = data.genres


    createCategories(categories, categoriesPreviewList);
}

async function getTrendingMovies() {
    const { data } = await api('trending/movie/week', {
        params: {
            "language": lang
        }
    });
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection, { lazyload: true });


    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.textContent = 'cargar mas';
    // btnLoadMore.addEventListener('click', () => {getPaginatedTrendingMovies();
    //     btnLoadMore.remove();})
    // genericSection.append(btnLoadMore);

}


async function getPaginatedTrendingMovies() {
    //infinite scroll
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
        page++
        const { data } = await api('trending/movie/week', {
            params: {
                page: page,
                'language': lang
            }
        });

        const movies = data.results;
        createMovies(movies, genericSection, { lazyLoad: true, clean: false });
        //     const btnLoadMore = document.createElement('button');
        //     btnLoadMore.innerText = 'Cargar más';
        //     btnLoadMore.addEventListener('click', () => {getPaginatedTrendingMovies();
        //         btnLoadMore.remove();});
        //     genericSection.appendChild(btnLoadMore);
        // }
    }
}

async function getMovieById(id) {
    const { data: movie } = await api(`movie/${id}`);

    const movieImgUrl = `https://image.tmdb.org/t/p/original${movie.poster_path}`;

    headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${movieImgUrl})`
    movieDetailTitle.textContent = movie.title;
    movieDetailScore.textContent = movie.vote_average;
    movieDetailDescription.textContent = movie.overview;

    createCategories(movie.genres, movieDetailCategoriesList)
}


async function getRelatedMoviesId(id) {
    const { data: movie } = await api(`movie/${id}/recommendations`);
    const result = movie.results;
    relatedMoviesContainer.innerHTML = ""
    createMovies(result, relatedMoviesContainer, { lazyload: true })
    relatedMoviesContainer.scrollTo(0, 0);
}

async function getMoviesBySearch(query) {
    const { data } = await api(`search/movie`, {
        params: {
            query: query
        }
    });
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection, { lazyload: true })

}

function getPaginatedMoviesBySearch(query) {
    return async function () {  //infinite scroll
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight
            - 15);

        const pageIsNotMax = page < maxPage;

        if (scrollIsBottom && pageIsNotMax) {
            page++
            const { data } = await api(`search/movie`, {
                params: {
                    query,
                    page
                },
            });


            const movies = data.results;
            createMovies(movies, genericSection, { lazyLoad: true, clean: false });
        }
    }
}

async function getMovieByCategory(id) {
    const { data } = await api(`discover/movie`, {
        params: {
            with_genres: id
        }
    });
    const movies = data.results;
    maxPage = data.total_pages
    createMovies(movies, genericSection, { lazyload: true })

}

function getPaginatedMoviesByCategory(id) {
    return async function () {  //infinite scroll
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight
            - 15);

        const pageIsNotMax = page < maxPage;
        if (scrollIsBottom && pageIsNotMax) {
            page++
            const { data } = await api(`discover/movie`, {
                params: {
                    with_genres: id,
                    page
                }
            });


            const movies = data.results;
            createMovies(movies, genericSection, { lazyLoad: true, clean: false });
        }
    }
}

function getLikedMovies() {
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies)

    createMovies(moviesArray, likedMoviesContainer, { lazyload: true, clean: true });


}

