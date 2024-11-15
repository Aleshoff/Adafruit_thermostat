import { useState, useMemo, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import GaugeSetTemp from "./components/GaugeSetTemp";
import GaugeTemp from "./components/GaugeTemp";
import Chart from "./components/Chart";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { Container, Row, Col, Navbar, Button } from "react-bootstrap";
import Spinner from "./components/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useToken from "./useToken";
import SignUp from "./components/SignUp";

//const UNSPLASH_KEY = process.env.REACT_APP_UNSPLASH_KEY;
const API_URL = process.env.REACT_APP_API_URL || "https://alolprojectspace.com";

function App() {
  const [temperature, setNewTemperature] = useState(23);
  const [actualTemperature, setActualTemperature] = useState(0);
  const [statisticsTemperatures, setStatisticsTemperatures] = useState([]);
  const [loader, setLoader] = useState(true);
  const { token, setToken } = useToken();
  const [isSignUped, setIsSignUped] = useState(true);

  const getActualDashBoard = async () => {
    try {
      const result = await axios.get(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActualTemperature(parseFloat(result.data.temperature) || 0);
      setNewTemperature(result.data.setTemperature);
      setStatisticsTemperatures(result.data.statistics);
      setLoader(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getActualDashBoard();
    }
  }, [token]);

  useMemo(() => {
    if (token) {
      const interval = setInterval(() => {
        getActualDashBoard();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [token]);


  if (!token) {
    return (
      <div>
        <Header title="Thermostat" />
        {isSignUped ? (
          <Login setToken={setToken} setIsSignUped={setIsSignUped} />
        ) : (
          <SignUp setIsSignUped={setIsSignUped} />
        )}
        <Footer />
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setToken("");
  };

  return (
    <div>
      <Header title="Thermostat" />
      <br />
      <Navbar data-bs-theme="light">
        <Container className="justify-content-end">
          <Button variant="link" size="lg" onClick={handleLogin}>
            Logout
          </Button>
        </Container>
      </Navbar>
      {loader ? (
        <Spinner />
      ) : (
        <>
          <Container className="mt-2" style={{width:"1000px"}}>
            <Row xs={1} md={2} lg={2}>
              <Col className="pb-3">
                <GaugeTemp data={actualTemperature } token={token}/>
              </Col>
              <Col className="pb-3">
                <GaugeSetTemp token={token} temp={temperature} setTemperature={setNewTemperature} />
              </Col>
            </Row>
            <Row xs={1} md={1} lg={1}>
              <Col className="pb-4">
                <Chart data={statisticsTemperatures}/>
              </Col>
              </Row>

            <Navbar style={{ maxWidth: "20rem", height: "4rem" }} />
          </Container>
          <Navbar fixed="bottom">
            <Container>
              <Footer />
            </Container>
          </Navbar>
        </>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
