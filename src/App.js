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

const handleOnChange = (setData) => (e) => {
  setData(data => ({
    ...data,
    actorDetails: [],
    actorAge: null,
  }));
  if (e.target.value) {
    axios.get(
      `${API.searchPersonUrl}&query=${e.target.value}`
    ).then((response) => {
      setData(data => ({
        ...data,
        searchResults: response.data.results,
      }));
    })
  }
  setData(data => ({
    ...data,
    searchResults: [],
  }));
}

const handleOnClick = (id, setData) => () => {
  setData(data => ({
    ...data,
    searchResults: [],
  }));
  axios.get(
    API.getMoviesUrl(id)
  ).then((response) => {
    console.log(response.data.cast);
    setData(data => ({
      ...data,
      actorDetails: response.data.cast,
    }))
  }).then(() => {
    axios.get(
      API.getActorUrl(id)
    ).then(response => {
      setData(data => ({
        ...data,
        actorAge: response.data.birthday,
      }));
    })
  })
};

const App = () => {
  const [data, setData] = useState({
    searchResults: [],
    actorDetails: [],
    actorAge: null,
  });
  return (
    <>
      <input onChange={handleOnChange(setData)} />
      {
        data.searchResults && data.searchResults.map(searchResult => (
          <div
            onClick={handleOnClick(searchResult.id, setData)}
            key={searchResult.id}
          >
            {searchResult.name}
          </div>
        )
        )}
      {
        data.actorDetails && data.actorDetails.map(actorDetail =>
          <div key={actorDetail.id}>
            {actorDetail.original_title} - <strong>{differenceInCalendarYears(actorDetail.release_date, data.actorAge)}</strong>
          </div>
        )
      }
    </>
  );
}

export default App;
