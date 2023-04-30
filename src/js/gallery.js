// import "simplelightbox/dist/simple-lightbox.min.css";
// import SimpleLightbox from "simplelightbox";
// import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm";
// const SimpleLightbox = require('simplelightbox');



function renderGalleryElement({webformatURL, largeImageURL, tags, likes, views, downloads, comments},icons) { 
    return`
<div class="gallery__item">
   <a class="gallery__link" href="${largeImageURL}">
      <img class="gallery__image" src="${webformatURL}" alt="${tags}" />
      <div class="gallery__overlay">
       ${icons}
       <p>${renderNumber(likes)}</p>
       <p>${renderNumber(views)}</p>
       <p>${renderNumber(downloads)}</p>
       <p>${renderNumber(comments)}</p>
       </div>   
   </a>
</div>`;
}
export default function renderGallery(array, icons){
    return array.map(e => renderGalleryElement(e,icons)).join(``)
}

function renderNumber(number){
    const k = 1000
    if (number < k) return number
    if (number < 100 * k) return `${Math.floor(number / 100)/10}K+`
    if (number < k * k) return `${Math.floor(number / k)}K+`
    if (number < 100 * k * k) return `${Math.floor(number / (100 * k))/10}M+`
    if (number < k * k * k) return `${Math.floor(number / (k * k))}M+`
    return `${Math.floor(number / (100 * k * k)) / 10}B+`
}