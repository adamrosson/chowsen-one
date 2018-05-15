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
