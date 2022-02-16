import Header from "../Header";
import Landing from "../Landing";
import Footer from "../Footer";
import Welcome from "../Welcome";
import Login from "../Login";
import Signup from "../Signup";
import ErrorPage from "../ErrorPage";
import "../../App.css";

function App() {
  return (
    <div>
      <Header />

      <Welcome />
      <Landing />
      <Login />
      <Signup />
      <ErrorPage />

      <Footer />
    </div>
  );
}

export default App;
