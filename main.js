var eventBus = new Vue()

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">

            <div class="product-image">
              <img v-bind:src="image">
            </div>
            
            <div class="product-info">
            
              <h1>{{ title }}</h1>
              <p v-if="inStock">In stock</p>
              <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
              <p>User is premium: {{ premium }}</p>
              <info-tabs :shipping="shipping" :details="details"></info-tabs>
              <!--
              <p>Shipping: {{ shipping }}
              <ul>
                <li v-for="detail in details">{{ detail }}</li>
              </ul>-->

              <div class="color-box"
              v-for="(variant, index) in variants"
              :key="variant.variantId"
              :style="{ backgroundColor: variant.variantColor }"
              @mouseover="updateProduct(index)">
              </div>

              <!--<select>
                <option v-for="variant in variants" :key="variant.variantId">
                  {{ variant.variantColor }}
                </option>
              </select> -->
              <div class="botones">
              <button class="btn btn-primary" v-on:click="addToCart"
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }">Add to cart</button>
              <button class="btn btn-danger" v-on:click="remToCart">Remove to cart</button>
              </div>
            </div>

            <product-tabs :reviews="reviews"></product-tabs>

            
          </div>
          `,

          data() {
                return {
                    brand: 'Vue mastery',
                    product: 'Socks',
                    selectedVariant: 0,
                    details: ["80% Algodon", "20% Poliester", "Garantia 2 Años"],
                    variants: [
                        {
                            variantId: 2234,
                            variantColor: "white",
                            variantImage: 'img/calcetines2.jpg',
                            variantQuantity: 15
                        },
                        {
                            variantId: 2235,
                            variantColor: "black",
                            variantImage: 'img/calcetines1.jpg',
                            variantQuantity: 0
                        }
                    ],
                    reviews: []
                    }
                },
            methods: {
                addToCart() {
                    this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
                },
                remToCart() {
                    this.$emit('rem-to-cart', this.variants[this.selectedVariant].variantId)
                },
                updateProduct(index) {
                    this.selectedVariant = index
                    console.log(index)
                }
            },
            computed: {
                title() {
                    return this.brand + ' ' + this.product
                },
                image() {
                    return this.variants[this.selectedVariant].variantImage
                },
                inStock() {
                    return this.variants[this.selectedVariant].variantQuantity
                },
                shipping() {
                    if (this.premium) {
                        return "Free"
                    }
                    return 2.99
                }
            },
            mounted() {
                eventBus.$on('review-submitted', productReview => {
                    this.reviews.push(productReview)
                })
            }
}),

/*Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <div class="details">
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
        </div>
        `
    
})*/

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
        <b>Please correct the following error(s): </b>
        <ul>
            <li v-for="error in errors">
            {{ error }}
            </li>
        </ul>
    </p>
    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="name">
    </p>
    
    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>

    <p>
    <label for="recomend">¿Recomendarias este producto?</label>

      <p>Yes</p><input type="radio" id="recomend" v-model="recomend" name="recomend" value="Yes">

      <p>No</p><input type="radio" id="recomend" v-model="recomend" name="recomend" value="No">

    </p>
        
    <p>
      <input type="submit" value="Submit">  
    </p>    
  
  </form>
        `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recomend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    recomend: this.recomend,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.recomend = null
                this.rating = null
            }
            else {
                if(!this.name) this.errors.push("Name required")
                if(!this.review) this.errors.push("Review required")
                if(!this.rating) this.errors.push("Rating required")
            }
        }
    }
    
})

Vue.component('product-tabs', {
    props: {
        reviews: {
        type: Array,
        required: false}
    },
    template: `
        <div>
            <ul>
            <span class="tab"
                :class="{ activeTab: selectedTab === tab}"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="selectedTab = tab">
                {{ tab }}</span>

                <div v-show="selectedTab === 'Reviews'">
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet</p>
                <ul>
                    <li v-for="review in reviews">
                    <p>Name: {{ review.name }}</p>
                    <p>Comment: {{ review.review }}</p>
                    <p>Recomend?: {{ review.recomend }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    </li>
                </ul>
            </div>

            <product-review v-show="selectedTab === 'Make a review'">
            </product-review>

            </ul>
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a review'],
            selectedTab: 'Reviews'
        }
    }
})

Vue.component('info-tabs', {
    props: {
       shipping: {required: true},
       details: {
        type: Array,   
        required: true}
    },
    template: `
        <div>
            <ul>
            <span class="tab"
                :class="{ activeTab: selectedTab === tab}"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="selectedTab = tab">
                {{ tab }}</span>

                <div v-show="selectedTab === 'Shipping'">
                <p>Shipping: {{ shipping }}
                
            </div>

            <div v-show="selectedTab === 'Details'">
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>
            </div>

            </ul>
        </div>
    `,
    data() {
        return {
            tabs: ['Shipping', 'Details'],
            selectedTab: 'Shipping'
        }
    }
})

var app = new Vue ({
    el: '#app',
    data: {
        premium: true,
        //details: ['80% Algodon', '20% Poliester', 'Garantia 2 Años'],
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        remCart(id) {
            this.cart.pop(id)
        }
    }
})


