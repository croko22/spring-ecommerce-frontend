import { describe, expect, test } from 'bun:test'

import {
  parseProductQuery,
  PRODUCT_DEFAULT_PAGE_SIZE,
  stringifyProductQuery
} from '../app/utils/productListingQuery'

describe('product listing query helpers', () => {
  test('parses route query and applies defaults', () => {
    expect(parseProductQuery({})).toEqual({
      search: '',
      category: '',
      page: 1,
      size: PRODUCT_DEFAULT_PAGE_SIZE,
      sort: 'name',
      priceMin: null,
      priceMax: null,
      inStock: null
    })

    expect(parseProductQuery({ q: '  shoes ', category: 'Footwear', page: '3', size: '24', sort: 'price-desc', priceMin: '10', priceMax: '100', inStock: 'true' })).toEqual({
      search: 'shoes',
      category: 'Footwear',
      page: 3,
      size: 24,
      sort: 'price-desc',
      priceMin: 10,
      priceMax: 100,
      inStock: true
    })
  })

  test('stringifies state omitting default values', () => {
    expect(stringifyProductQuery({
      search: '',
      category: '',
      page: 1,
      size: PRODUCT_DEFAULT_PAGE_SIZE,
      sort: 'name',
      priceMin: null,
      priceMax: null,
      inStock: null
    })).toEqual({})

    expect(stringifyProductQuery({
      search: 'jacket',
      category: 'Apparel',
      page: 2,
      size: 24,
      sort: 'rating',
      priceMin: 10,
      priceMax: 200,
      inStock: true
    })).toEqual({
      q: 'jacket',
      category: 'Apparel',
      page: '2',
      size: '24',
      sort: 'rating',
      priceMin: '10',
      priceMax: '200',
      inStock: 'true'
    })
  })
})
