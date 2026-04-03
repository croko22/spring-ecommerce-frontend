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
      size: PRODUCT_DEFAULT_PAGE_SIZE
    })

    expect(parseProductQuery({ q: '  shoes ', category: 'Footwear', page: '3', size: '24' })).toEqual({
      search: 'shoes',
      category: 'Footwear',
      page: 3,
      size: 24
    })
  })

  test('stringifies state omitting default values', () => {
    expect(stringifyProductQuery({
      search: '',
      category: '',
      page: 1,
      size: PRODUCT_DEFAULT_PAGE_SIZE
    })).toEqual({})

    expect(stringifyProductQuery({
      search: 'jacket',
      category: 'Apparel',
      page: 2,
      size: 24
    })).toEqual({
      q: 'jacket',
      category: 'Apparel',
      page: '2',
      size: '24'
    })
  })
})
