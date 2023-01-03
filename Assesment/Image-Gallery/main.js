const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

/* Declaring the array of image filenames */

const imgNames = ["pic1.jpg", "pic2.jpg", "pic3.jpg", "pic4.jpg", "pic5.jpg"];


/* Declaring the alternative text for each image file */

const altText = {
    "pic1.jpg": "Closeup of a human eye",

    "pic2.jpg": "Satellite image of a waterbed; the structure gives the appearance of the underside of a mushroom",

    "pic3.jpg": "Closeup of purple and white flowers",

    "pic4.jpg": "Ancient Egyptian art on a wall",

    "pic5.jpg": "a brown butterfly on a big green leaf"
}

/* Looping through images */

imgNames.forEach((element) => {

const newImage = document.createElement('img');
newImage.setAttribute('src', `images/${element}`);
newImage.setAttribute('alt', altText[`${element}`]);

newImage.addEventListener('click', () => { 
    displayedImage.setAttribute('src', `images/${element}`)
    displayedImage.setAttribute('alt', altText[`${element}`])});

    thumbBar.appendChild(newImage);

});

/* Wiring up the Darken/Lighten button */

btn.addEventListener('click', () => {
    if (btn.getAttribute('class') === 'dark') {
        btn.setAttribute('class', 'light');
        btn.textContent = 'Lighten';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    } else {
        btn.setAttribute('class', 'dark');
        btn.textContent = 'Darken';
        overlay.style.backgroundColor = 'rgba(0,0,0,0)';
    }
});
