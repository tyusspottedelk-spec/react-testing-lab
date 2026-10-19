import { fireEvent, render, screen, within } from '@testing-library/react'
import { vi } from 'vitest'
import App from '../../components/App'

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
    description: 'Southwest quinoa bowl',
    category: 'Food',
    amount: -10.55,
  },
  {
    id: '3',
    date: '2019-12-03',
    description: 'MetroCard',
    category: 'Transportation',
    amount: -25,
  },
]

function renderTransactions() {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(transactions),
  }))
  return render(<App />)
}

describe('searching and sorting transactions', () => {
  it('updates the displayed transactions when the search input changes', async () => {
    renderTransactions()
    await screen.findByText('Southwest quinoa bowl')

    fireEvent.change(screen.getByPlaceholderText('Search your Recent Transactions'), {
      target: { value: 'metro' },
    })

    expect(screen.getByText('MetroCard')).toBeInTheDocument()
    expect(screen.queryByText('Southwest quinoa bowl')).not.toBeInTheDocument()
    expect(screen.queryByText('Paycheck from Bob’s Burgers')).not.toBeInTheDocument()
  })

  it('searches transaction categories without case sensitivity', async () => {
    renderTransactions()
    await screen.findByText('MetroCard')

    fireEvent.change(screen.getByPlaceholderText('Search your Recent Transactions'), {
      target: { value: 'fOoD' },
    })

    expect(screen.getByText('Southwest quinoa bowl')).toBeInTheDocument()
    expect(screen.queryByText('MetroCard')).not.toBeInTheDocument()
  })

  it('sorts transactions by the selected category', async () => {
    renderTransactions()
    await screen.findByText('MetroCard')
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'category' } })

    const rows = screen.getAllByRole('row').slice(1)
    const categories = rows.map(row => within(row).getAllByRole('cell')[2].textContent)
    expect(categories).toEqual(['Food', 'Income', 'Transportation'])
  })
})