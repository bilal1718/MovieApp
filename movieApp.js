const apiKey = `5746c6d8d3e831f0356c49a98679a828`;
const container = document.querySelector('.container');
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', performSearch);
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', performSearch);
let allMovies = [];
let isSearchActive = false;

// Function to fetch random page from the API
async function randomPageFetch() {
  const randomPage = Math.floor(Math.random() * 500) + 1;
  const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${randomPage}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const randomMovies = data.results;
    allMovies = allMovies.concat(randomMovies);
    const randomIndex = Math.floor(Math.random() * randomMovies.length);
    return randomMovies[randomIndex];
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to prepare the card structure and show the values
function preparingRandomMovie(movie) {
  const card = document.createElement('div');
  card.classList.add('movie-card');
  card.setAttribute('data-movie-id', movie.id);

  const img = document.createElement('img');
  img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  card.appendChild(img);

  const movieInfo = document.createElement('div');
  movieInfo.classList.add('movie-info');

  const title = document.createElement('h3');
  title.textContent = movie.title;
  movieInfo.appendChild(title);

  const rating = document.createElement('p');
  rating.textContent = `Rating: ${movie.vote_average}`;
  movieInfo.appendChild(rating);

  const overview = document.createElement('p');
  overview.textContent = movie.overview;
  movieInfo.appendChild(overview);

  card.appendChild(movieInfo);
  container.appendChild(card);
}

// Function to perform search
async function performSearch() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();

  // Clear the container
  container.innerHTML = '';

  // Filter the movie data array
  const filteredMovies = allMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchInput)
  );

  if (filteredMovies.length > 0) {
    filteredMovies.forEach((movie) => {
      preparingRandomMovie(movie);
    });
  } 
  else {
    try {
      const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchInput}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      const searchResultMovies = data.results;

      // Check if any movies were found in the search results
      if (searchResultMovies.length > 0) {
        searchResultMovies.forEach((movie) => {
          preparingRandomMovie(movie);
        });
      } else {
        // Display a message when no movies match the search keyword
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'No movies found.';
        container.appendChild(noResultsMessage);
      }
    } catch (error) {
      console.error(error);
    }
  }
  isSearchActive = true;
}


// Function to load movie cards
async function showingMovieCards(numCards = 9) {
  if (!isSearchActive) {
    let i = 0;
    while (i < numCards) {
      const movie = await randomPageFetch();
      if (movie) {
        const isMoviePresent = allMovies.some((mov) => mov.id === movie.id);
        const isMovieShown = container.querySelector(`[data-movie-id="${movie.id}"]`);
        if (isMoviePresent && !isMovieShown ) {
          preparingRandomMovie(movie);
          i++;
        }
      }
    }
  }
}

// Initial loading of movie cards
showingMovieCards();

// Load more movie cards when user scrolls to the end of the page
window.addEventListener('scroll', () => {
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
    showingMovieCards();
  }
});
