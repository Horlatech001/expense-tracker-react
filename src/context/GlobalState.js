import React, { createContext, useReducer, useEffect } from "react";

// Function to get transactions from localStorage
const getLocalStorageTransactions = () => {
  const transactions = localStorage.getItem("transactions");
  return transactions ? JSON.parse(transactions) : [];
};

// Initial state
const initialState = {
  transactions: getLocalStorageTransactions(),
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider Component
export const GlobalProvider = ({ children }) => {
  const AppReducer = (state, action) => {
    switch (action.type) {
      case "DELETE_TRANSACTION":
        return {
          ...state,
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== action.payload
          ),
        };
      case "ADD_TRANSACTION":
        const newTransactions = [action.payload, ...state.transactions];
        localStorage.setItem("transactions", JSON.stringify(newTransactions));
        return {
          ...state,
          transactions: newTransactions,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  function deleteTransaction(id) {
    dispatch({
      type: "DELETE_TRANSACTION",
      payload: id,
    });
  }

  function addTransaction(transaction) {
    dispatch({
      type: "ADD_TRANSACTION",
      payload: transaction,
    });
  }

  useEffect(() => {
    // Update localStorage whenever transactions change
    localStorage.setItem("transactions", JSON.stringify(state.transactions));
  }, [state.transactions]);

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        deleteTransaction,
        addTransaction,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
