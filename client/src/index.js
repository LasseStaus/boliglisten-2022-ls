'use strict'
window.addEventListener('DOMContentLoaded', init)
const API_URL = 'http://localhost:3000/api/properties'

const property_container = document.querySelector('.properties')
const buttons_sorting = document.querySelectorAll('[data-action="sort"]')
const inputs_filter = document.querySelectorAll('[data-action="filter"]')
const btn_clear_filter = document.querySelector('.clear__filter')
const size_min = document.getElementById('size_minimum')
const size_max = document.getElementById('size_maximum')
const amount_of_properties = document.querySelector('.amount__of__properties')

let initialProperties = []
let currentList = []
let filterTimer

inputs_filter.forEach((button) => {
  button.addEventListener('keydown', () => {
    if (filterTimer) clearTimeout(filterTimer)
    filterTimer = setTimeout(() => {
      filterList()
    }, 200)
  })
})
buttons_sorting.forEach((button) => {
  button.addEventListener('click', sortList)
})
btn_clear_filter.addEventListener('click', resetFilter)

async function init() {
  const response = await fetch(`${API_URL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const responseData = await response.json()
  initialProperties = responseData
  currentList = initialProperties
  populateList(currentList)
}

function populateList(propertyList) {
  property_container.innerHTML = ''
  propertyList.forEach((p) => {
    const price = formatPrice(p.price)
    const type = formatType(p.type)
    const item = `
        <div class="property">
          <div class="img__container">
              <img class="property__image" src="${p.img}" alt="Billede af et hus i ${p.city}" />
              <p class="property__title">${p.title}</p>
          </div
          <div>
              <div class="property__info">
                <p class="property__specs">${type} &#x2022; ${p.rooms} rum &#x2022; ${p.size} m<sup>2</sup> 
                </p>
                <p class="property__address__city"> ${p.address.city}, ${p.address.zip}</p>
              <div class="property__info__end"> 
                <p class="property__address__road">${p.address.street} ${p.address.number} S</p>
                <p class="property__price">${price} kr.</p>
              </div>
          </div>
        </div>`
    property_container.insertAdjacentHTML('beforeend', item)
  })
  amount_of_properties.textContent = propertyList.length + ' Boliger fundet'
}
function sortList(e) {
  const sortDirection = e.target.dataset.direction
  if (property_container.dataset.direction === sortDirection) return
  buttons_sorting.forEach((b) => {
    b.classList.remove('selected')
  })
  e.target.classList.add('selected')
  currentList = sortListBy(sortDirection, currentList)
  property_container.dataset.direction = sortDirection
  populateList(currentList)
}

function sortListBy(sortDirection, list) {
  switch (sortDirection) {
    case 'desc': {
      return list.sort((a, b) => Number(a.price) - Number(b.price))
    }
    case 'asc': {
      return list.sort((a, b) => Number(b.price) - Number(a.price))
    }
  }
  return list
}

function getSqaurefeetValues() {
  let low_value = size_min.value
  let high_value = size_max.value
  if (!size_min.value) {
    low_value = 0
  }
  if (!size_max.value) {
    high_value = 9999
  }
  return [low_value, high_value]
}
function filterList() {
  const [low_value, high_value] = getSqaurefeetValues()
  const sortDirection = property_container.dataset.direction
  const filteredList = initialProperties.filter(
    (property) => Number(property.size) >= low_value && Number(property.size) <= high_value
  )
  currentList = sortListBy(sortDirection, filteredList)
  populateList(currentList)
}

function resetFilter() {
  size_min.value = ''
  size_max.value = ''
  filterList()
}

function formatPrice(price) {
  return Number(price).toLocaleString('da-DA')
}
function formatType(type) {
  return type.split('_').join(' ')
}
