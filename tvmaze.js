/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */

      async function searchShows(query) {
        let response = await axios.get(
          `http://api.tvmaze.com/search/shows?q=${query}`);
          console.log(response.data)
      
        let shows = response.data.map(result => {
          let show = result.show;
          return {
            id: show.id,
            name: show.name,
            summary: show.summary,
            image: show.image ? show.image.medium : 'https://tinyurl.com/tv-missing'
          };
        });
      
        return shows;
      }
      



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
         </div>
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
           <button class="episodesBtn">Episodes</button>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});



/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  // TODO: return array-of-episode-info, as described in docstring above
  let episodes = res.data.map(episodeList => ({    
      id: episodeList.id,
      name: episodeList.name,
      season: episodeList.season,
      number: episodeList.number
  }));
  return episodes;
}


function populateEpisodes(episodes){
  let $epList = $('#episodes-list')
  $epList.empty();

  for (let episode of episodes) {
    let $item = $(`<ul>${episode.id}</ul>
    <li>${episode.name}(season ${episode.season}, number ${episode.number})</li>
  `);

  $epList.append($item);
  }
  $("#episodes-area").show();  
}



$("#shows-list").on("click", ".episodesBtn", async function handlerEpidsodesBtn(evt){
  let showID = $(evt.target).closest(".Show").data("show-id")
  let episodes = await getEpisodes(showID);
  populateEpisodes(episodes);
});

