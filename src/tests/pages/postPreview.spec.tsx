import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { getPrismicClient } from '../../services/prismics'
import { getSession, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'

jest.mock('../../services/prismics')
jest.mock('next-auth/client')
jest.mock('next/router')

const post = {
  slug: 'my-new-post',
  title: 'My new post',
  content: '<p>Post summary</p>',
  updatedAt: 'May, 19',
}

describe('Post preview Page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<Post post={post} />)

    expect(screen.getByText('My new post')).toBeInTheDocument()
    expect(screen.getByText('Post summary')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
    expect(screen.getByText('May, 19')).toBeInTheDocument()
  })

  it('redirects user to full article when subscription is found', async () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMocked = jest.fn()

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-subscription' },
      false,
    ] as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any)

    render(<Post post={post} />)

    expect(pushMocked).toHaveBeenCalledWith('/posts/my-new-post')
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'My new post' }],
          content: [{ type: 'paragraph', text: 'Post summary' }],
        },
        last_publication_date: '04-01-2021',
      }),
    } as any)

    const response = await getStaticProps({
      params: { slug: 'my-new-post' },
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post summary</p>',
            updatedAt: '01 de abril de 2021',
          },
        },
      })
    )
  })
})
