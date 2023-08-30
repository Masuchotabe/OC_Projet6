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
        this.create_navigation()
        this.container = this.element.querySelector(".carousel-container")

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
        let next_button = this.create_div_with_class("carousel-button next")
        let previous_button = this.create_div_with_class("carousel-button previous")
        this.element.appendChild(next_button)
        this.element.appendChild(previous_button)
        next_button.addEventListener("click", this.next.bind(this))
        previous_button.addEventListener("click", this.previous.bind(this))
    }

    next () {
        console.log('nexxxxxt')
        let width = - this.container.children[0].getBoundingClientRect().width
        console.log(width)
        this.container.scroll({
            left: -width,
            behavior: "smooth",
            });
    }

    previous () {
        console.log('previouuuuus')

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

    new Carousel(document.querySelector('#War'), {
        slides_to_scroll: 1,
        slides_visible: 3
    })
})


