import { render, screen } from '@testing-library/react'
import { stripe } from '../../services/stripe'
import { mocked } from 'ts-jest/utils'

import Home, { getStaticProps } from '../../pages'

jest.mock('next/router')
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false],
  }
})

jest.mock('../../services/stripe')

describe('Home Page', () => {
  it('renders correctly', () => {
    render(<Home product={{ amount: 'R$10,00', priceId: 'fake-price' }} />)

    expect(screen.getByText(/R\$10,00/i)).toBeInTheDocument()
  })

  it('loads initial Data', async () => {
    const retricePricesStripeMocked = mocked(stripe.prices.retrieve)

    retricePricesStripeMocked.mockResolvedValueOnce({
      id: 'fake-id',
      unit_amount: 10000,
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-id',
            amount: '$100.00',
          },
        },
      })
    )
  })
})
