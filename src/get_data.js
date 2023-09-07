
/**
 * Cette fonction récupère le nombre d'éléments souhaités à partir de l'url demandé
 * @param {number} number_of_items - Nombre d'item souhaités
 * @param {string} url_to_fetch - url à fetch.
 * @returns {number} les données sous forme de liste d'objets .
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

function create_div_with_class(class_name){
    let div = document.createElement('div')
    div.className=class_name
    return div
}

function create_div_from_data(item_list, genre){
    const container = document.querySelector(".container")

    const carousel = create_div_with_class("carousel")
    carousel.setAttribute('id', genre)
    const carousel_container = create_div_with_class("carousel-container")
    item_list.forEach(item => {
        let child_div = create_div_with_class('carousel-item')
        let image = document.createElement('img')
        image.src = item.image_url
        image.alt = item.title
        child_div.appendChild(image)
        carousel_container.appendChild(child_div)
    })
    carousel.appendChild(carousel_container)
    container.appendChild(carousel)
}



async function init_data(url, genre){
    let items = await get_first_result(7, url)
    await create_div_from_data(items, genre)
    // return;
}


async function main(){
    let base_url = 'http://localhost:8000/api/v1/'
    let genres = ["Fantasy", "War", "Comedy"]
    let promise_to_wait = []

    genres.forEach(genre => {
        promise_to_wait.push(init_data(base_url + `titles/?genre=${genre}&sort_by=-imdb_score`, genre))
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