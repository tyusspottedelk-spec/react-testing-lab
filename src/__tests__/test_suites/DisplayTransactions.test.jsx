import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import App from '../../components/App'

describe('displaying transactions', () => {
  it('loads and displays transactions on startup', async () => {
    const transactions = [
      {
        id: '1',
        date: '2019-12-01',
        description: 'Paycheck from Bob’s Burgers',
        category: 'Income',
        amount: 1000,
      },
      {
        id: '2',
        date: '2019-12-02',
        description: 'Lunch at Fresh & Co',
        category: 'Food',
        amount: -10.55,
      },
    ]
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(transactions),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    expect(await screen.findByText('Paycheck from Bob’s Burgers')).toBeInTheDocument()
    expect(screen.getByText('Lunch at Fresh & Co')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:6001/transactions')
  })
})