import React, {useState, useEffect} from "react";
import TransactionsList from "./TransactionsList";
import Search from "./Search";
import AddTransactionForm from "./AddTransactionForm";
import Sort from "./Sort";

const transactionsUrl = import.meta.env.VITE_TRANSACTIONS_URL ?? "http://localhost:6001/transactions"

function AccountContainer() {
  const [transactions,setTransactions] = useState([])
  const [search,setSearch] = useState("")
  const [sortBy,setSortBy] = useState("description")

  useEffect(()=>{
    fetch(transactionsUrl)
    .then(r=>r.json())
    .then(data=>setTransactions(data))
  },[])

  function postTransaction(newTransaction){
    fetch(transactionsUrl,{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTransaction)
    })
    .then(r=>r.json())
    .then(data=>setTransactions(currentTransactions=>[...currentTransactions,data]))
  }

  function onSort(sortBy){
    setSortBy(sortBy)
  }

  const normalizedSearch = search.trim().toLowerCase()
  const visibleTransactions = transactions
    .filter(transaction => Object.values(transaction).some(value =>
      String(value).toLowerCase().includes(normalizedSearch)
    ))
    .sort((first, second) =>
      String(first[sortBy] ?? "").localeCompare(String(second[sortBy] ?? ""))
    )

  return (
    <div>
      <Search setSearch={setSearch}/>
      <AddTransactionForm postTransaction={postTransaction}/>
      <Sort onSort={onSort}/>
      <TransactionsList transactions={visibleTransactions} />
    </div>
  );
}

export default AccountContainer;
