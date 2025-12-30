import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { store } from "./redux/store"; 
import { Provider } from "react-redux";
import { initializeAuth } from "./redux/slices/authSlice";

// Initialize auth state from localStorage on app startup
store.dispatch(initializeAuth());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider  store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
