import React, { useState } from 'react';
import './App.css';

import axios from 'axios';
import { differenceInCalendarYears } from 'date-fns';

const API_KEY = '7b25c97101de1db8db80fe1bfae994e0';

const API = {
  searchPersonUrl: `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&append_to_response=movies`,
  getMoviesUrl: (id) => `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_KEY}&language=en-US`,
  getActorUrl: (id) => `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US`,
};

const handleOnChange = (setSearchResults, setActorDetails, setActorAge) => (e) => {
  setActorDetails();
  setActorAge();
  if (e.target.value) {
    axios.get(
      `${API.searchPersonUrl}&query=${e.target.value}`
    ).then((response) => {
      console.log(response.data.results);
      setSearchResults(response.data.results);
    })
  }
  setSearchResults();
}

const handleOnClick = (id, setActorDetails, setSearchResults, setActorAge) => () => {
  setSearchResults();
  axios.get(
    API.getMoviesUrl(id)
  ).then((response) => {
    console.log(response.data.cast);
    setActorDetails(response.data.cast);
  }).then(() => {
    axios.get(
      API.getActorUrl(id)
    ).then(response => {
      setActorAge(response.data.birthday);
    })
  })
};

const App = () => {
  const [searchResults, setSearchResults] = useState();
  const [actorDetails, setActorDetails] = useState();
  const [actorAge, setActorAge] = useState();
  return (
    <>
      <input onChange={handleOnChange(setSearchResults, setActorDetails, setActorAge)} />
      {
        searchResults && searchResults.map(searchResult => (
          <div
            onClick={handleOnClick(searchResult.id, setActorDetails, setSearchResults, setActorAge)}
            key={searchResult.id}
          >
            {searchResult.name}
          </div>
        )
        )}
      {
        actorDetails && actorDetails.map(actorDetail =>
          <div key={actorDetail.id}>
            {actorDetail.original_title} - <strong>{differenceInCalendarYears(actorDetail.release_date, actorAge)}</strong>
          </div>
        )
      }
    </>
  );
}

export default App;
