"use strict";

const imgContainer = document.querySelector(".img_container");
const coordsContainer = document.querySelector(".coords_container");
const searchInput = document.querySelector(".search_input");
const latInput = document.querySelector(".lat_input");
const lonInput = document.querySelector(".lon_input");
const searchBtn = document.querySelector(".search_btn");
let keyword, imageUrl;

const validateCoords = () => {
  window.reload;
  const regex = /^[0-9.-]+$/;

  const isLatValid = regex.test(latInput.value);
  const isLonValid = regex.test(lonInput.value);

  latInput.style.color = isLatValid ? "green" : "red";
  lonInput.style.color = isLonValid ? "green" : "red";

  if (isLatValid && isLonValid) {
    getCoords(latInput.value, lonInput.value);
  }
  //   latInput.value = "";
  //   lonInput.value = "";
};

// ----- Nominatim API -----

const renderCoords = (data) => {
  console.log(data);
  const html = `<div class="text-center">
  <h2>Welcome to ${data.features[0].properties.name.toUpperCase()}</h2>
  <p>${data.features[0].properties.display_name}</p>
</div>`;

  keyword = `${data.features[0].properties.name}, ${data.features[0].properties.address.country}, ${data.features[0].properties.address.city}`;
  console.log(keyword);
  getImg(keyword);

  coordsContainer.innerHTML = html;
};

const getCoords = (lat, lon) => {
  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${+lat}&lon=${+lon}`
  )
    .then((response) => response.json())
    .then((data) => {
      renderCoords(data);
    }).catch((error) => {
      renderError(`Something went wrong! ${error}`);
    });
};

// ----- Pexels API -----

const renderImg = (imageUrl, photographer, photographerID, photoAlt) => {
  const html = `<h2 class="text-center">${photoAlt}</h2>
          <img src="${imageUrl}" alt="${keyword}" class="img-fluid object-fit-cover rounded  d-flex m-auto" />
          <figcaption class="text-center">
            <a href="https://www.pexels.com">Photos provided by Pexels</a>
            <p>This<a href="${imageUrl}">Photo</a> was taken by 
              <a href="https://www.pexels.com/@${photographerID}">${photographer}</a>
               on Pexels.</p>
          </figcaption>`;

  imgContainer.innerHTML = html;
};

const getImg = (keyword) => {
  // All requests made with the client will be authenticated
  const apiKey = "g2ySsBvMxhNiKjXnt2CfGuT5pG7tNQE9ADHumSqN62usKbq1qsl6xtqH";
  // Make the API request to Pexels
  fetch("https://api.pexels.com/v1/search?query=" + keyword, {
    headers: {
      Authorization: apiKey,
    },
  })
    .then((response) => {
      if (!response.ok)
        throw new Error(`Image not found. (${response.status})`);
      return response.json();
    })
    .then((data) => {
      // Extract the URL of a random image
      let photos = data.photos;
      let randomIndex = Math.floor(Math.random() * photos.length);
      imageUrl = photos[randomIndex].src.medium;
      let photographer = photos[randomIndex].photographer;
      let photographerID = photos[randomIndex].photographer_id;
      let photoAlt = photos[randomIndex].alt;
      renderImg(imageUrl, photographer, photographerID, photoAlt);
    })
    .catch((error) => {
      renderError(`Something went wrong! ${error}`);
    });
};

searchBtn.addEventListener("click", validateCoords);
