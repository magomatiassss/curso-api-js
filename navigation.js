searchFormBtn.addEventListener('click', () => {
    location.hash = `#search=${searchFormInput.value.trim()}`;
});


trendingBtn.addEventListener('click', () => {
    location.hash = '#trends='
});
arrowBtn.onclick = () => window.history.back()

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {

location.hash.startsWith('#trends')    ? trendsPage()       :
location.hash.startsWith('#search=')   ? searchPage()       :
location.hash.startsWith('#movie=')    ? movieDetailsPage() :
location.hash.startsWith('#category=') ? categoriesPage()   :
homePage()
    
    location.hash 
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
}


function homePage() {
    console.log('HOME!!');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');

    headerCategoryTitle.classList.add('inactive');
    headerTitle.classList.remove('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesMoviesPreview();

}

function categoriesPage() {
    console.log('CATEGORIES!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');

    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive')

const [_, categorydata] = location.hash.split('=');
const [categoryid,categoryname] = categorydata.split('-');

headerCategoryTitle.innerHTML = decodeURIComponent(categoryname);
getMovieByCategory(categoryid);

}

function movieDetailsPage() {
    console.log('MOVIE!!');

    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');

    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive')

    const [_, movieId] = location.hash.split('=');
    getMovieById(movieId);
    getRelatedMoviesId(movieId);
}

function searchPage() {
    console.log('Search!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
  
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, query] = location.hash.split('=');
    getMoviesBySearch(query);


}


function trendsPage() {
    console.log('TRENDS!!');    
    
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');

    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias';
    getTrendingMovies()
}



async function getMoviesBySearch(query) {
    const {data} = await api(`search/movie`,{
        params: {
           query: query
        }
    });
    const movies = data.results;
    
    createMovies(movies,genericSection)

}

async function getMovieByCategory(id) {
    const {data} = await api(`discover/movie`,{
        params: {
            with_genres: id
        }
    });
    const movies = data.results;
    
    createMovies(movies,genericSection)

}




