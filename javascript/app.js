const addNewRestaurant = (name) => ({name})
const addToRestaurantList = (name,list=[]) => list.concat([name]);
const removeNthItem = (i,list = []) => {
    if (i < list.length) {
        list.splice(i, 1);
    } else {
        throw new Error('error');
    }
    return list;
};

$(document).ready(function(){
  $('.slide-wrapper').slick({
		autoplay: true,
  	autoplaySpeed: 5000,
		slidesToShow: 1,
  	slidesToScroll: 1,
  	arrows: false,
  });
});

const render = () => {
	let htmlStr = '<ul class="list-group">';
	for(let i = 0; i < restaurantList.length; i++) {
		htmlStr += `<li class="list-group-item">
			<span contenteditable="true" onblur="updateText(${i})" class="restaurant-item-${i}">${restaurantList[i].name}</span>
			<button onclick="removeItemButtonAction(${i})" type="button" class="btn remove-button js-remove">X</button>
		</li>`;
	}
	htmlStr += "</ul>";
	document.querySelector('.js-data').innerHTML = htmlStr;
	document.querySelector('.js-restaurant-name-input').value = '';
}

const updateText = (index) => {
	restaurantList[index].name = $(".restaurant-item-"+index).text();
}

let restaurantList = [];

const addNewRestaurantButton = document.querySelector('.js-additem');
addNewRestaurantButton.addEventListener('click', e => {
	e.preventDefault();
	const nameInput = document.querySelector('.js-restaurant-name-input').value;
	const newListItem = addNewRestaurant(nameInput);
	restaurantList = addToRestaurantList(newListItem, restaurantList);
	render();
});

const removeItemButtonAction = (name) => {
	removeNthItem(name, restaurantList);
	render();
}

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}

const randomItemButton = document.querySelector('.js-randomize-button');
const resultWrapper = document.querySelector('.js-result-wrapper');
randomItemButton.addEventListener('click', e => {
	e.preventDefault();
	let randomName = restaurantList[Math.floor(Math.random()*restaurantList.length)].name;
	resultWrapper.innerText = randomName;
});

const yelpSearch = $(".js-yelp-search-button").click(function() {
  const yelpSearchInput = document.querySelector('.js-restaurant-yelp-input').value;
  event.preventDefault();
  Yelp.search(yelpSearchInput).then( businesses => {
    renderYelpResults(businesses);
  });
});

const renderYelpResults = (businesses) => {
  let htmlStr = '<ul class="list-group">';
	for(let i = 0; i < businesses.length; i++) {
		htmlStr += `<li class="list-group-item">
			<span class="restaurant-item-${i}">${businesses[i].name}</span>
		</li>`;
	}
	htmlStr += "</ul>";
  document.querySelector('.js-yelp-returned-results').innerHTML = htmlStr;
  document.querySelector('.js-restaurant-yelp-input').value = '';
}

const Yelp = {
  search(term){
    console.log("start yelp api call");
    return fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=Denver`,
    {
      headers: {Authorization: `Bearer E0eCUDCKd9MhLPXrNsIrI6rIeVcLoWiLM3mOVHuhd6kYVdJVJXiy4E7g2CWXLRXj2Ai5-BW2504oju7M44Yd5EoLj3qLLjyU8vyN7kbcA6ilSuw_WLi74M6gyYD4WnYx`}
    }).then( response => {
      console.log('response is', response);
      return response.json();
    }).then( jsonResponse => {
      if (jsonResponse.businesses) {
        console.log(jsonResponse.businesses);
        return jsonResponse.businesses.map( business => ({
          id: business.id,
          imageSrc: business.image_url,
          name: business.name,
          address: business.location.address1,
          city: business.location.city,
          state: business.location.state,
          zipCode: business.location.zip_code,
          category: business.categories[0].title,
          rating: business.rating,
          reviewCount: business.review_count
        }));
      }
    });
  }
};
