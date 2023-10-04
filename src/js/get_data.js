/**
 * Récupère les données d'un film en particulier à partir de l'id
 * @param film_id
 * @returns {Promise<*>}
 */
async function get_film(film_id){
    let url = base_url + `titles/${film_id}`
    let response = await fetch(url)
    let data
    if (response.ok){
        data = await response.json()
    }
    return data
}

/**
 * Crée un élement html, div par défaut avec la classe correspondante
 * @param class_name
 * @param elm_type
 * @returns {HTMLDivElement}
 */
function create_HTML_element_with_class(class_name, elm_type='div'){
    let elm = document.createElement(elm_type)
    elm.className=class_name
    return elm
}

/**
 * Crée une image à partir des données du film
 * @param data
 * @returns {HTMLImageElement}
 */
function create_img_from_data(data){
    let image = document.createElement('img')
    image.src = data.image_url
    image.alt = data.title
    image.onerror = function() {
        this.src="images/logo.png"
        this.classList.add("image-not-found")
        let parent_div = this.parentElement
        let title = create_HTML_element_with_class("no-image-title","p")
        title.textContent = this.alt
        parent_div.appendChild(title)
    }
    return image
}

const base_url = 'http://localhost:8000/api/v1/'



/**
 * Cette fonction récupère le nombre d'éléments souhaités à partir de l'url demandé
 * @param {number} number_of_items - Nombre d'item souhaités
 * @param {string} url_to_fetch - url à fetch.
 * @returns {list} les données sous forme de liste d'objets.
 */
async function get_first_result(number_of_items, url_to_fetch){
    let item_list = []
    let number_of_fetch_item = 0
    let url = url_to_fetch

    while (number_of_fetch_item < number_of_items) {
        let response = await fetch(url)
        let data
        if (response.ok){
            data = await response.json()
        }else{
            continue
        }


        for (const item of data.results){

            if (number_of_fetch_item < number_of_items) {
                item_list.push(item)
                number_of_fetch_item++
            } else {
                break
            }
        }
        if (data.next) {
            url = data.next
        } else {
            break
        }
    }
    if (number_of_items === number_of_fetch_item){
        return item_list
    }
    return null
}

/**
 * Crée les div des carousel à oartir des données recues
 * @param item_list
 * @param carousel_id
 */
function create_carousel_from_data(item_list, carousel_id){
    const container = document.querySelector(".container")

    const carousel = create_HTML_element_with_class("carousel")
    carousel.setAttribute('id', carousel_id)
    const carousel_container = create_HTML_element_with_class("carousel-container")
    item_list.forEach(item => {

        let child_div = create_HTML_element_with_class('carousel-item')
        child_div.dataset.id = item.id
        let image = create_img_from_data(item)
        child_div.appendChild(image)
        carousel_container.appendChild(child_div)
    })
    carousel.appendChild(carousel_container)
    container.appendChild(carousel)
}


/**
 * Initialise un carousel en récupérant les données puis en créant le carousel à partir des données
 * @param url
 * @param carousel_id
 * @returns {Promise<void>}
 */
async function init_categories_data(url, carousel_id){
    let items = await get_first_result(7, url)
    await create_carousel_from_data(items, carousel_id)
}

/**
 * Crée la div sur le meilleur film
 * @param film_data
 * @returns {Promise<void>}
 */
async function create_best_film_div(film_data){
    const container = document.querySelector(".container")

    let div = create_HTML_element_with_class("best-movie")
    let details_div = create_HTML_element_with_class("movie-details")
    let title = create_HTML_element_with_class( "movie-title", 'h1')
    title.textContent = film_data.title
    details_div.appendChild(title)
    let button = document.createElement("button")
    button.dataset.id=film_data.id
    button.textContent = "Details"
    details_div.appendChild(button)
    let description  =create_HTML_element_with_class("movie-tiny-desc", "p")
    description.textContent = film_data.description
    details_div.appendChild(description)


    let image_div = create_HTML_element_with_class("image-container")
    let image = create_img_from_data(film_data)
    image_div.appendChild(image)
    div.appendChild(image_div)

    div.appendChild(details_div)
    container.appendChild(div)
}

/**
 * Gère l'initialisation des films les mieux notés ( le meilleur et les 7 suivants)
 * @param url
 * @returns {Promise<void>}
 */
async function init_best_scored_data(url){
    let items = await get_first_result(8, url)
    let first_item = await get_film(items[0].id)
    await create_best_film_div(first_item)
    await create_carousel_from_data(items.slice(1), 'top-rated')
}

/**
 * fonction principale qui déclenche la lecture des données puis envoie un evenement pour delchencer la mise en forme
 * @returns {Promise<void>}
 */
async function main(){
    let genres = ["Fantasy", "War", "Comedy"]
    let promise_to_wait = []

    promise_to_wait.push(init_best_scored_data(base_url+ "titles/?sort_by=-imdb_score"))
    await Promise.all(promise_to_wait)
    genres.forEach(genre => {
        promise_to_wait.push(init_categories_data(base_url + `titles/?genre=${genre}&sort_by=-imdb_score`, genre))
    })

    await Promise.all(promise_to_wait)

    const event = new Event('AllDataComplete');
    document.dispatchEvent(event);

}

main()

