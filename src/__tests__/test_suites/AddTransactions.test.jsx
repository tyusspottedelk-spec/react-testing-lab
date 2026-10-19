import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import App from '../../components/App'

describe('adding transactions', () => {
  it('posts a new transaction and displays it in the frontend', async () => {
    const initialTransactions = [
      {
        id: '1',
        date: '2019-12-01',
        description: 'Existing transaction',
        category: 'Income',
        amount: 1000,
      },
    ]
    const createdTransaction = {
      id: '2',
      date: '2020-01-03',
      description: 'Coffee with friends',
      category: 'Food',
      amount: '12.5',
    }
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(initialTransactions),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createdTransaction),
      })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    await screen.findByText('Existing transaction')
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Coffee with friends' },
    })
    fireEvent.change(screen.getByPlaceholderText('Category'), {
      target: { value: 'Food' },
    })
    fireEvent.change(screen.getByPlaceholderText('Amount'), {
      target: { value: '12.5' },
    })
    fireEvent.change(document.querySelector('input[name="date"]'), {
      target: { value: '2020-01-03' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add Transaction' }))

    expect(await screen.findByText('Coffee with friends')).toBeInTheDocument()
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    expect(fetchMock).toHaveBeenLastCalledWith(
      'http://localhost:6001/transactions',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: '2020-01-03',
          description: 'Coffee with friends',
          category: 'Food',
          amount: '12.5',
        }),
      }),
    )
  })
})