import { create_HTML_element_with_class, get_film } from "./get_data.js"

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
            this.previous_button.classList.add('button-hidden')

        } else if (this.container.scrollLeft + this.container.offsetWidth == this.container.scrollWidth){ //TODO A MODIFIER scrollleftmax
            this.next_button.classList.add('button-hidden')
        } else {
            this.next_button.classList.remove('button-hidden')
            this.previous_button.classList.remove('button-hidden')

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


