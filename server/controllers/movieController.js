const axios = require("axios");

module.exports = {
  getMoviesList: (req, res) => {
    let movieList = [];
    const { list } = req.query;
    const { page } = req.query;
  
    // console.log(req.query)
    axios
      .get(
        `https://api.themoviedb.org/3/movie/${list}?api_key=b0905bacefecc34fb178a826419bdf12&language=en-US&page=${page}`
      )
      .then((response) => {
        // console.log(response.data)
        movieList = [...response.data.results];
        res.status(200).send(movieList);
      })
      .catch((err) => res.status(500).send(err));
  },

  getLatestMovies: (req, res) => {
    let movieList = []
    const {list} = req.query
    axios.get(
      `https://api.themoviedb.org/3/movie/latest?api_key=b0905bacefecc34fb178a826419bdf12&language=en-US`
    )
    .then((response) => {
      // console.log(response.data)
      // movieList = [...response.data.results]
      res.status(200).send(response.data)})},
      
  addUserMovieList: (req, res) => {
    // console.log('hit')
    const db = req.app.get("db");
    const { user_id } = req.params,
      { movie_id } = req.body;
    // console.log(req.params)
    // console.log(req.body)

    db.movies
      .add_user_movie(user_id, movie_id)
      .then(res.sendStatus(200))
      .catch((err) => res.status(500).send(err));
  },
  
  getUserMovieList: async (req, res) => {
    const db = req.app.get("db");
    const { user_id } = req.params;

    let movieIdArr = await db.movies.get_user_movies(user_id)
    // console.log(movieIdArr)
     let likedMovies = movieIdArr.map((element) => axios.get(
          `https://api.themoviedb.org/3/movie/${element.movie_id}?api_key=b0905bacefecc34fb178a826419bdf12&language=en-US`
          ).then((a) => {
            return a.data
          })
          .catch((err) => res.status(500).send(err))
          )
          const results = await Promise.all(likedMovies)
          // console.log(likedMovies)
          // console.log(results[0])
          results.splice(0,1)
          // console.log(results)
          return res.status(200).send(results)
  },
  deleteUserMovie: (req, res) => {
    const db = req.app.get("db");
    const { user_id } = req.query;
    const { movie_id } = req.params;

    db.movies
      .delete_user_movie(user_id, movie_id)
      .then((list) => res.status(200).send(list))
      .catch((err) => res.status(500).send(err))
  },

  getNowPlaying: (req, res) => {
    axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=b0905bacefecc34fb178a826419bdf12&language=en-US&page=1`
    )
    .then((response) => {
      // console.log(response.data.results)
      res.status(200).send(response.data)
    })
    .catch(err => console.log(err))
  },

  getTopRated: (req, res) => {
    axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=b0905bacefecc34fb178a826419bdf12&language=en-US&page=1`
    )
    .then((response) => {
      res.status(200).send(response.data)
    })
    .catch(err => console.log(err))
  },

  getPopular: (req, res) => {
    axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=b0905bacefecc34fb178a826419bdf12&language=en-US&page=1`
    )
    .then((response) => {
      res.status(200).send(response.data)
    })
    .catch(err => console.log(err))
  },

  randomMovie: (req, res) => {
    const randomMovie = []
    const random = Math.ceil(Math.random() * 151)

    if(req.query.id) {
      axios.get(`https://api.themoviedb.org/3/movie/${req.query.id}?api_key=b0905bacefecc34fb178a826419bdf12&language=en-US`)
      .then(response => {
        randomMovie.push(response.data)
        res.status(200).send(randomMovie)
      })
    } else {
      axios.get(`https://api.themoviedb.org/3/movie/${random}?api_key=b0905bacefecc34fb178a826419bdf12&language=en-US`)
      .then(response => {
        randomMovie.push(response.data)
        res.status(200).send(randomMovie)
      })
    }

  },

  getTrailer: (req, res) => {
    const {id} = req.params
    axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=b0905bacefecc34fb178a826419bdf12&language=en-US`)
    .then(response => {
      res.status(200).send(response.data)
    })
    .catch(err => console.log(err))
  },
  getGenreList: (req, res) => {
    const {genre, page} = req.query;
    let genreMovieList = [];

    // console.log(req.query)
    axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=b0905bacefecc34fb178a826419bdf12&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genre}`)
    .then((response) => {
      genreMovieList = [...response.data.results];
      res.status(200).send(genreMovieList)
    })
    .catch((err) => res.status(500).send(err))
  },
  getSimilarMovies: (req, res) => {
    const {movie_id} = req.params;
    let similarMovieList = [];

    axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/similar?api_key=b0905bacefecc34fb178a826419bdf12&language=en-US&page=1`)
    .then((response) => {
      similarMovieList = [...response.data.results];
      res.status(200).send(similarMovieList)
    })
    .catch((err) => res.status(500).send(err))
  },
  getMovieSuggestion: (req, res) => {
    const genreId = {
      Action: 28,
      Adventure: 12,
      Animation: 16,
      Comedy: 35,
      Crime: 80,
      Documentary: 99,
      Drama: 18,
      Family: 10751,
      Fantasy: 14,
      History: 36,
      Horror: 27,
      Music: 10402,
      Mystery: 9648,
      Romance: 10749,
      SciFi: 878,
      Thriller: 53,
      War: 10752,
      Western: 37
    }

    const db = req.app.get('db');
    const {user_id} = req.params;
    // console.log(req.params)

    db.movies.get_user_genres(user_id)
    .then((genres) => {
      let genreOne = genres[0].movie_category_1;
      let genreTwo = genres[0].movie_category_2;
      let genreThree = genres[0].movie_category_3;

      let userGenreArr = [genreId[genreOne], genreId[genreTwo], genreId[genreThree]];

      // console.log(userGenreArr)

      function getRandomNum(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max-min + 1)) + min;
      }
      let randomIndex = getRandomNum(0,2)
      let page = getRandomNum(1,100)
      let genre = userGenreArr[randomIndex]

      // console.log(genre)
      
      axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=b0905bacefecc34fb178a826419bdf12&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genre}`)
      .then((response) => {
        // console.log(response.data.results)
        res.status(200).send(response.data.results)
      })
    })
  }
};
