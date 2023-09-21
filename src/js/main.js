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
                console.log(film_data)
                init_popup_from_film_data(film_data)
            })
        })
        // this.child_width = Math.max(...Array.from(this.container.children).map(div => div.clientWidth))
        // for()
        // this.container.style.width = 3 * this.child_width + 'px'
        this.create_navigation()
        this.container.addEventListener('scroll', () => this.check_display_nav_buttons())
        // console.log(container.children.length)
        // let ratio = container.children.length / this.options.slides_visible
        //
        // for (let elm of container.children){
        //     console.log(elm)
        //     elm.style.width = ratio*100 + '%'
        // }
        // // this.element.appendChild(container)
    }

    get_capitalize_title(original_title){
        // let words = original_title.replace('-', " ").split(" ")
        return original_title.replace('-', " ").split(" ").map((word) => {
            return word[0].toUpperCase() + word.substring(1);
        }).join(" ");

    }

    create_navigation () {
        this.next_button = this.create_div_with_class("carousel-button next")
        this.previous_button = this.create_div_with_class("carousel-button previous")
        this.element.appendChild(this.next_button)
        this.element.appendChild(this.previous_button)
        this.next_button.addEventListener("click", this.next.bind(this))
        this.previous_button.addEventListener("click", this.previous.bind(this))
        this.check_display_nav_buttons()
    }

    check_display_nav_buttons() {
        // console.log(this.container)
        if (this.container.scrollLeft == 0){
            this.previous_button.classList.add('hidden')

        } else if (this.container.scrollLeft + this.container.offsetWidth == this.container.scrollWidth){ //TODO A MODIFIER scrollleftmax
            this.next_button.classList.add('hidden')
        } else {
            this.next_button.classList.remove('hidden')
            this.previous_button.classList.remove('hidden')

        }


    }
    next () {
        let width = this.container.getBoundingClientRect().width

        this.container.scrollBy({
            top: 0,
            left: width,
            behavior:'smooth'
        })
    }

    previous () {
        let width = this.container.getBoundingClientRect().width

        this.container.scrollBy({
            top:0,
            left:-width,
            behavior:'smooth'
        })

    }

    /**
     * @param {string} class_name
     * @returns {HTMLDivElement}
     */
    create_div_with_class(class_name){
        let div = document.createElement('div')
        div.className=class_name
        return div
    }
}

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

    let img = create_img_from_data(film_data)
    img.classList.add('popup-image')
    content.appendChild(img)

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
    imdb_score.innerHTML = "<span class=\"label\">IMDB Score : </span>" +  film_data.imdb_score
    footer.appendChild(imdb_score)

    let rated = document.createElement('p')
    rated.innerHTML = "<span class=\"label\">Rated : </span>" +  film_data.rated
    footer.appendChild(rated)

    let countries = document.createElement('p')
    countries.innerHTML = "<span class=\"label\">Countries : </span>" +  film_data.countries
    footer.appendChild(countries)

    let worldwide_gross_income = document.createElement('p')
    worldwide_gross_income.innerHTML = "<span class=\"label\">Box office : </span>" +  film_data.worldwide_gross_income
    footer.appendChild(worldwide_gross_income)

    let date_published = document.createElement('p')
    date_published.innerHTML = "<span class=\"label\">Published Date : </span>" +  film_data.date_published
    footer.appendChild(date_published)

    let duration = document.createElement('p')
    duration.innerHTML = "<span class=\"label\">Duration : </span>" +  film_data.duration + 'min'
    footer.appendChild(duration)





    film_content.appendChild(footer)
    popup_content.appendChild(film_content)

    popup.classList.remove('hidden')
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
})


