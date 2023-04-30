import axios from 'axios';

export default class GalleryAPI{
    static #API_KEY = '35837403-e3eb495b2214d16b5d801685b'
    static #BASE_URL = 'https://pixabay.com/api/'
    #params = {}

    constructor(){
        this.#params.key = GalleryAPI.#API_KEY
        this.#params.page = 1
        this.#params.per_page = 18
        this.#params.q = ''
        this.#params.image_type = 'photo'
        this.#params.orientation = 'horizontal'
        this.#params.safesearch = true
        this.isListEnd = false
        this.totalHits = 0
        this.count = 0
    }

    fetchImages() {
        const params = this.#params
    
        return axios.get(GalleryAPI.#BASE_URL,{params})
        .then(r => r.data)
        .then(r => {
            this.totalHits = r.totalHits
            if (r.totalHits > (this.#params.per_page * this.#params.page)) {
                this.isListEnd = false;
                this.pageInc()
            } else {
                this.count += r.hits.length
                this.isListEnd = true;
            }
            return r.hits
        })
        .catch((error) => {
            console.log(error);
            return error
        })
    }
    
    pageInc(){
        this.#params.page++
        this.count += this.#params.per_page
    }

    get query(){
        return this.#params.q
    }
    set query(text){
        this.#params.q = text.trim()
        this.#params.page = 1
        this.count = 0;
    }
    get perPage(){
        return this.#params.per_page
    }
    set perPage(number){
        this.#params.per_page = number
    }
}