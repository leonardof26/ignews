import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { getPrismicClient } from '../../services/prismics'

import Posts, { getStaticProps } from '../../pages/posts'

jest.mock('../../services/prismics')

const posts = [
  {
    slug: 'my-new-post',
    title: 'My new post',
    summary: 'Post summary',
    updatedAt: 'May, 19',
  },
]

describe('Posts Page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('My new post')).toBeInTheDocument()
    expect(screen.getByText('Post summary')).toBeInTheDocument()
    expect(screen.getByText('May, 19')).toBeInTheDocument()
  })

  it('loads initial Data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [{ type: 'heading', text: 'My new post' }],
              content: [{ type: 'paragraph', text: 'Post summary' }],
            },
            last_publication_date: '04-01-2021',
          },
        ],
      }),
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'my-new-post',
              summary: 'Post summary',
              title: 'My new post',
              updatedAt: '01 de abril de 2021',
            },
          ],
        },
      })
    )
  })
})
