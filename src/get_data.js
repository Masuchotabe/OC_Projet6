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
            //  On vérifie qu'on arrive bien à récupérer l'image sinon on continue
            try {
                const image_response = await fetch(item.image_url)
                if (!image_response.ok) {
                    continue
                }
            } catch (error) {
                console.log("Erreur pour récupérer une image : " + error.message)
                continue
            }
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
        console.log('Super, tout les éléments ont été récupérés')
        return item_list
    } else {
        console.log("Ohh dommage le nombre d'élément ne correspond pas... nombre obtenu : "+ number_of_fetch_item)
    }
    return null
}

async function get_film(film_id){
    let url = base_url + `titles/${film_id}`
    let response = await fetch(url)
    let data
    if (response.ok){
        data = await response.json()
    }
    return data
}


function create_HTML_element_with_class(class_name, elm_type='div'){
    let elm = document.createElement(elm_type)
    elm.className=class_name
    return elm
}
function create_img_from_data(img_data){
    let image = document.createElement('img')
    image.src = img_data.image_url
    image.alt = img_data.title
    return image
}


function create_carousel_from_data(item_list, carousel_id){
    const container = document.querySelector(".container")

    const carousel = create_HTML_element_with_class("carousel")
    carousel.setAttribute('id', carousel_id)
    const carousel_container = create_HTML_element_with_class("carousel-container")
    item_list.forEach(item => {

        let child_div = create_HTML_element_with_class('carousel-item')
        let image = create_img_from_data(item)
        child_div.appendChild(image)
        carousel_container.appendChild(child_div)
    })
    carousel.appendChild(carousel_container)
    container.appendChild(carousel)
}



async function init_categories_data(url, carousel_id){
    let items = await get_first_result(7, url)
    await create_carousel_from_data(items, carousel_id)
}

async function create_best_film_div(film_data){
    const container = document.querySelector(".container")

    let div = create_HTML_element_with_class("best-movie")
    let details_div = create_HTML_element_with_class("movie-details")
    let title = create_HTML_element_with_class( "movie-title", 'h1')
    title.textContent = film_data.title
    details_div.appendChild(title)
    let button = document.createElement("button")
    button.textContent = "Détails"
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

async function init_best_scored_data(url){
    let items = await get_first_result(8, url)
    let first_item = await get_film(items[0].id)
    await create_best_film_div(first_item)
    await create_carousel_from_data(items.slice(1), 'best-rated')
    // return;
}


async function main(){
    // let base_url = 'http://localhost:8000/api/v1/'
    let genres = ["Fantasy", "War", "Comedy"]
    let promise_to_wait = []

    promise_to_wait.push(init_best_scored_data(base_url+ "titles/?sort_by=-imdb_score"))
    await Promise.all(promise_to_wait)
    genres.forEach(genre => {
        promise_to_wait.push(init_categories_data(base_url + `titles/?genre=${genre}&sort_by=-imdb_score`, genre))
    })

    await Promise.all(promise_to_wait)
    // console.log(uri_list)

    const event = new Event('AllDataComplete');
    document.dispatchEvent(event);

}

main()

// main().then(() => {
//     console.log('Chargement de la page terminé!')
// }
// )

// some_data = get_first_result(7, base_url+uri1)