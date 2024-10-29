import { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Search from "./components/Search";
import Login from "./components/Login";
import ImageCard from "./components/ImageCard";
import { Container, Row, Col, Navbar, Button } from "react-bootstrap";
import Welcome from "./components/Welcome";
import Spinner from "./components/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useToken from "./useToken";
import SignUp from "./components/SignUp";

//const UNSPLASH_KEY = process.env.REACT_APP_UNSPLASH_KEY;
const API_URL = process.env.REACT_APP_API_URL || "https://alolprojectspace.com";

function App() {
  const [word, setWord] = useState("");
  const [images, setImages] = useState([]);
  const [loader, setLoader] = useState(true);
  const { token, setToken } = useToken();
  const [isSignUped, setIsSignUped] = useState(true);

  //console.log(images);

  const getSavedImages = async () => {
    try {
      const result = await axios.get(`${API_URL}/images`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(result.data || []);
      setLoader(false);
      // toast.success("Login Succesful!", {
      //   toastId: "custom-id-yes"});
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // useEffect(() => {
  //   getSavedImages();
  // }, []);

  useMemo(() => {
    if (token) getSavedImages();
  }, [token]);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    //console.log(word);
    // fetch(
    //   `${API_URL}/new-photo?query=${word}`
    // )
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setImages([{ ...data, title: word }, ...images]);
    //   })
    //   .catch((error) => console.log(error));

    try {
      const result = await axios.get(`${API_URL}/new-photo?query=${word}`);
      setImages([{ ...result.data, title: word }, ...images]);
      toast.info(`New Image ${word.toUpperCase()} was found!`);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setWord("");
  };

  const handleDeleteImage = async (id) => {
    const imageToDelete = images.find((image) => image.id === id);

    try {
      const result = await axios.delete(`${API_URL}/images/${id}`, {
        data: imageToDelete,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (result.data?.deleted_id) {
        toast.warn(
          `Image ${images.find((image) => image.id === id).title.toUpperCase()} was Deleted!`
        );
        setImages(images.filter((image) => image.id !== id));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleSavedImage = async (id) => {
    const imageToSave = images.find((image) => image.id === id);
    imageToSave.saved = true;

    try {
      const result = await axios.post(`${API_URL}/images`, imageToSave, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (result.data?.inserted_id) {
        setImages(
          images.map((image) =>
            image.id === id ? { ...image, saved: true } : image
          )
        );
        toast.info(`Image ${imageToSave.title.toUpperCase()} was saved!`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  //console.log(word);
  //console.log(UNSPLASH_KEY);
  if (!token) {
    return (
      <div>
        <Header title="Photo Gallery" />
        {isSignUped ? (
          <Login setToken={setToken} setIsSignUped={setIsSignUped} />
        ) : (
          <SignUp setIsSignUped={setIsSignUped} />
        )}
        <Footer />
      </div>
    );
  }

  const handleLogin = (e) => {
    e.preventDefault();
    setToken("");
  };

  return (
    <div>
      <Header title="Photo Gallery" />
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
          <Search
            word={word}
            setWord={setWord}
            handleSubmit={handleSearchSubmit}
          />
          <Container className="mt-4">
            {images.length ? (
              <Row xs={1} md={2} lg={3}>
                {images.map((image, i) => (
                  <Col key={i} className="pb-3">
                    <ImageCard
                      image={image}
                      deleteImage={handleDeleteImage}
                      saveImage={handleSavedImage}
                    />
                  </Col>
                  
                ))}
              </Row>
            ) : (
              <Welcome />
            )}
            <Navbar style={{ maxWidth: "20rem", height: "4rem" }}/>
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
