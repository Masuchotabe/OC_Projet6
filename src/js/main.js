import { create_HTML_element_with_class, get_film, create_img_from_data } from "./get_data.js"

class Carousel {
    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.element = element
        let title = create_HTML_element_with_class("carousel-title", "h1")
        title.textContent = this.get_capitalize_title(this.element.getAttribute('id').toString())
        this.element.insertBefore(title, this.element.firstChild )
        this.container = this.element.querySelector(".carousel-container")
        let carousel_items = this.container.childNodes
        carousel_items.forEach(function(item) {
            item.addEventListener("click", async function(event) {
                let film_data = await get_film(item.dataset.id)
                init_popup_from_film_data(film_data)
            })
        })

        this.create_navigation()
        this.container.addEventListener('scroll', () => this.check_display_nav_buttons())

    }

    /**
     * retourne le texte avec une majuscule sur la 1ere lettre de chaque mot
     * @param original_title
     * @returns {string}
     */
    get_capitalize_title(original_title){
        return original_title.replace('-', " ").split(" ").map((word) => {
            return word[0].toUpperCase() + word.substring(1);
        }).join(" ");

    }

    /**
     * Crée les boutons de navigation du carousel
     */
    create_navigation () {
        this.next_button = create_HTML_element_with_class("carousel-button next")
        this.previous_button = create_HTML_element_with_class("carousel-button previous")
        this.element.appendChild(this.next_button)
        this.element.appendChild(this.previous_button)
        this.next_button.addEventListener("click", this.next.bind(this))
        this.previous_button.addEventListener("click", this.previous.bind(this))
        this.check_display_nav_buttons()
    }

    /**
     * Gère l'affichage ou non des boutons de navigation du carousel
     */
    check_display_nav_buttons() {
        if (this.container.scrollLeft == 0){
            this.previous_button.classList.add('hidden')

        } else if (this.container.scrollLeft + this.container.offsetWidth == this.container.scrollWidth){
            this.next_button.classList.add('hidden')
        } else {
            this.next_button.classList.remove('hidden')
            this.previous_button.classList.remove('hidden')
        }
    }

    /**
     * Gère le déplacement vers la fin du carousel
     */
    next () {
        let width = this.container.getBoundingClientRect().width

        this.container.scrollBy({
            top: 0,
            left: width,
            behavior:'smooth'
        })
    }

    /**
     * Gère le déplacement vers le début du carousel
     */
    previous () {
        let width = this.container.getBoundingClientRect().width

        this.container.scrollBy({
            top:0,
            left:-width,
            behavior:'smooth'
        })

    }
}

/**
 * Crée la popup à partir des datas du film
 * @param film_data
 */
function init_popup_from_film_data(film_data){
    let popup = document.querySelector('.popup')
    let popup_content = popup.querySelector('.popup-content')

    let close_button = popup_content.querySelector('#close-popup')
    close_button.addEventListener('click', () => {
        popup.classList.add('hidden')
        popup_content.removeChild(film_content)

    })
    let film_content = create_HTML_element_with_class('film-content')
    let header = document.createElement('header')
    let title = create_HTML_element_with_class('title', 'h2')
    title.textContent = film_data.title
    header.appendChild(title)
    film_content.appendChild(header)


    let content = create_HTML_element_with_class("content")
    let img_div = create_HTML_element_with_class("image-left")
    let image = create_img_from_data(film_data)
    image.classList.add('popup-image')
    img_div.appendChild(image)
    content.appendChild(img_div)

    let right_block = create_HTML_element_with_class("right-popup-column")
    let description = create_HTML_element_with_class("film_description", "p")
    description.innerHTML += "<span class=\"label\">Description : </span>" + film_data.long_description
    right_block.appendChild(description)

    let directors = document.createElement('p')
    directors.innerHTML += "<span class=\"label\">Directors : </span>" +  film_data.directors.join(", ")
    right_block.appendChild(directors)

    let actors = document.createElement('p')
    actors.innerHTML += "<span class=\"label\">Actors : </span>" +  film_data.actors.join(", ")
    right_block.appendChild(actors)

    let genres = document.createElement('p')
    genres.innerHTML += "<span class=\"label\">Genres : </span>" +  film_data.genres.join(", ")
    right_block.appendChild(genres)

    content.appendChild(right_block)
    film_content.appendChild(content)

    let footer = document.createElement('footer')
    let imdb_score = document.createElement('p')
    imdb_score.innerHTML = get_html_label_tag('IMDB Score') + film_data.imdb_score
    footer.appendChild(imdb_score)

    let rated = document.createElement('p')
    rated.innerHTML = get_html_label_tag('Rated') + film_data.rated
    footer.appendChild(rated)

    let countries = document.createElement('p')
    countries.innerHTML = get_html_label_tag('Countries') + film_data.countries
    footer.appendChild(countries)

    let worldwide_gross_income = document.createElement('p')
    worldwide_gross_income.innerHTML = get_html_label_tag('Box office') + film_data.worldwide_gross_income
    footer.appendChild(worldwide_gross_income)

    let date_published = document.createElement('p')
    date_published.innerHTML = get_html_label_tag('Published Date') + film_data.date_published
    footer.appendChild(date_published)

    let duration = document.createElement('p')
    duration.innerHTML = get_html_label_tag('Duration') + film_data.duration + 'min'
    footer.appendChild(duration)

    film_content.appendChild(footer)
    popup_content.appendChild(film_content)

    popup.classList.remove('hidden')
}

/**
 * Permet de récupérer un span avec class "label" qui sert de label
 * @param label
 * @returns {string}
 */
function get_html_label_tag(label){
    return "<span class=\"label\">" + label + " : </span>"
}


document.addEventListener('AllDataComplete', function () {

    new Carousel(document.querySelector('#top-rated'), {
    })
    new Carousel(document.querySelector('#War'), {
    })
    new Carousel(document.querySelector('#Fantasy'), {
    })
    new Carousel(document.querySelector('#Comedy'), {
    })
    let best_film = document.querySelector('.best-movie')
    let best_film_button = best_film.querySelector('button')
    best_film_button.addEventListener("click", async function(event) {
        let film_data = await get_film(event.target.dataset.id)
        init_popup_from_film_data(film_data)
    })
})


