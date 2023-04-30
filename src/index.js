import "simplelightbox/dist/simple-lightbox.min.css";
import SimpleLightbox from "simplelightbox";
import GalleryAPI from "./js/galleryAPI";
import renderGallery from "./js/gallery";
import { Notify } from "notiflix";
import throttle from "lodash.throttle";

const galleryAPI = new GalleryAPI();
const gallery = new SimpleLightbox('.gallery a',{captionsData: 'alt'});
const refs = {
    galleryElement: document.querySelector('div.gallery'),
    sentinelElement: document.getElementById('sentinel'),
    form: document.getElementById('search-form'),
    overlayIcons: document.querySelector('.gallery__overlay').innerHTML,
}
let cardHeight = 100;
const throttleOnclick = throttle(onScroll, 300)

refs.form.addEventListener('submit', onSubmit)
// window.addEventListener('scroll',throttleOnclick)

function onSubmit(e){

    e.preventDefault()

    if (!validate(e.currentTarget.searchQuery.value)) return


    refs.form.closest('.initial')?.classList.remove('initial')
    refs.sentinelElement.classList.add('lds-ellipsis')
    galleryAPI.q = e.currentTarget.searchQuery.value
    refs.galleryElement.innerHTML = ''

    galleryAPI.fetchImages().then(r=>{
        refs.sentinelElement.classList.remove('lds-ellipsis')
        if (galleryAPI.totalHits < 1) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            return;
        }
        Notify.success(`Hooray! We found ${galleryAPI.totalHits} images.`)
        refs.galleryElement.innerHTML = renderGallery(r, refs.overlayIcons);
        gallery.refresh()

        cardHeight = document.querySelector(".gallery").firstElementChild.getBoundingClientRect().height;
    })
    .finally(() => {
        if (!galleryAPI.isListEnd) intersectionObserver.observe(refs.sentinelElement);
    })
    intersectionObserver.unobserve(refs.sentinelElement)
}

function onScroll(){
    window.scrollBy({
        top: cardHeight,
        behavior: "smooth",
    });
}


const intersectionObserver = new IntersectionObserver((entries) => {
    if (entries[0].intersectionRatio <= 0) return;

    refs.sentinelElement.classList.add('lds-ellipsis')

    galleryAPI.fetchImages().then(r=>{
        if (galleryAPI.isListEnd){
            Notify.warning(`We're sorry, but you've reached the end of search results.`)
            refs.sentinelElement.classList.remove('lds-ellipsis')
            intersectionObserver.unobserve(refs.sentinelElement)
        }
        Notify.info(`Loaded new image. Total count:${galleryAPI.count}`)
        refs.galleryElement.insertAdjacentHTML('beforeend',renderGallery(r, refs.overlayIcons));
        gallery.refresh()
    })
    
  },{rootMargin: '200px'});

  function validate(value){
    if (!value) {
        Notify.info('Please enter something')
        return false;
    }
    if (!(value.trim())){
        Notify.info(`Spaces don't count`)
        return false;
    }
    return true
  }

