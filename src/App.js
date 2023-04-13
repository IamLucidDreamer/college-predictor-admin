// Importing Context From Redux
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";

// Importing Ant Design System
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";

// Importing Toast for Notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importing Components
import Routes  from "./routes/Index";

function App() {
  return (
    <Provider store={store}>
      {/* ToastContainer is Controlling all the Notifications  */}
      <ToastContainer />
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
