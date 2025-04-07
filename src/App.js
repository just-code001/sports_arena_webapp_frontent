import logo from './logo.svg';
import './App.css';
import Home from './Components/Home';
import  Card  from './Components/Card';
import HomeNavbar from './Components/HomeNavbar';
import background from "./Photos/test4.jpg";
import Slider from './Components/Slider';
import ContactPage from './Components/Contact';
import AboutPage from './Components/Aboutus';


function App() {
  return (

    <div className="App"
    style={{
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
      width: "100%",
    }}
    >
      <HomeNavbar/>
      <Home/>
      <Card/>
      <Slider/>
      <ContactPage/>
      <AboutPage/>
    </div>
  );
}

export default App;
