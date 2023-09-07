class Carousel {
    /**
     *
     * @param {HTMLElement} element
     * @param options
     * @param options.slides_to_scroll Nombre d'éléments à scroll
     * @param options.slides_visible Nombre d'éléments visible
     */
    constructor(element, options = {}) {
        this.element = element
        this.options = Object.assign({},{
            slides_to_scroll:1,
            slides_visible:3
        }, options)
        this.container = this.element.querySelector(".carousel-container")
        this.child_width = Math.max(...Array.from(this.container).map(div => div.clientWidth))
        // this.container.
        this.create_navigation()
        // console.log(container.children.length)
        // let ratio = container.children.length / this.options.slides_visible
        //
        // for (let elm of container.children){
        //     console.log(elm)
        //     elm.style.width = ratio*100 + '%'
        // }
        // // this.element.appendChild(container)
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
        if (this.container.scrollLeft == 0){
            this.previous_button.classList.add('button-hidden')

        } else if (this.container.scrollLeft == this.container.scrollLeftMax){
            this.next_button.classList.add('button-hidden')
        }
    }
    next () {
        console.log('nexxxxxt')
        let width = this.container.getBoundingClientRect().width

        this.container.scrollBy({
            top: 0,
            left: width,
            behavior:'smooth'
        })
        //     left: -width,
        //     behavior: "smooth",
        //     });
    }

    previous () {
        console.log('previouuuuus')
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

    new Carousel(document.querySelector('#best-rated'), {
    })
    new Carousel(document.querySelector('#War'), {
        slides_to_scroll: 1,
        slides_visible: 3
    })
    new Carousel(document.querySelector('#Fantasy'), {
        slides_to_scroll: 1,
        slides_visible: 3
    })
    new Carousel(document.querySelector('#Comedy'), {
        slides_to_scroll: 1,
        slides_visible: 3
    })
})


