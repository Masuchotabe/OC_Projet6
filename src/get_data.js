
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
        let data = await response.json()

        for (const item of data.results){
            // console.log(item)
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

function create_section_items(item_list, section){
    item_list.forEach(item => {
        const div = document.createElement('div')
        const image = document.createElement('img')
        image.src = item.image_url
        image.alt = item.title
        div.className = "carousel-item"
        div.appendChild(image)
        section.appendChild(div)
    })
}
let base_url = 'http://localhost:8000/api/v1/'
let uri1 = 'titles/?genre=Fantasy&sort_by=-imdb_score'
let uri2 = 'titles/?genre=War&sort_by=-imdb_score'
let uri3 = 'titles/?genre=Comedy&sort_by=-imdb_score'

async function main(){
    // console.log(get_first_result(7, base_url+uri1))
    // console.log(get_first_result(7, base_url+uri2))
    // console.log(get_first_result(7, base_url+uri3))
    // console.log(some_data)
    let data = await get_first_result(7, base_url+uri1)
    let section1 = document.getElementById('FantasySection')
    await create_section_items(data,section1)
    get_first_result(7, base_url+uri2)
    get_first_result(7, base_url+uri3)
}

main()
// main().then(() => {
//     console.log('Chargement de la page terminé!')
// }
// )

// some_data = get_first_result(7, base_url+uri1)