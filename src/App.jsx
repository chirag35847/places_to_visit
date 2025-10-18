import { useEffect, useRef, useState, useCallback } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js'

const STORAGE_KEY = "savedPlaces";

function App() {
  const selectedPlace = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentlySavedValue = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  const storedPlaces = currentlySavedValue.map((id)=> 
    AVAILABLE_PLACES.find((place)=>place.id===id)
  )

  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  // When a dep list is passed
  // empty -> only run on first time comoponent mount
  // non empty -> first time comoponent mount and any tmie the variable value changes 
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude
      const lon = position.coords.longitude
      const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES, lat, lon)
      setAvailablePlaces(sortedPlaces)
    })
  }, [])

  function handleStartRemovePlace(id) {
    setIsModalOpen(true);
    selectedPlace.current = id;
  }

  // first app comoponent render : memepry refernce was x47985238953
  // xx479852389523r2t
  function handleStopRemovePlace() {
    setIsModalOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    // get the previous list 
    // update it 
    // set it back
    const currentlySavedValue = JSON.parse(
      localStorage.getItem(STORAGE_KEY)) || []
    if (currentlySavedValue.indexOf(id) === -1) {
      localStorage.setItem(STORAGE_KEY,
        JSON.stringify([id,...currentlySavedValue])
      )
    }
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    console.log("executing handleRemovePlace")
    console.log(availablePlaces)
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => 
        place.id !== selectedPlace.current)
    );
    setIsModalOpen(false);

    const currentlySavedValue = JSON.parse(localStorage.getItem(
      STORAGE_KEY)) || []
    localStorage.setItem(STORAGE_KEY,
      JSON.stringify(currentlySavedValue.filter((id)=>
        id!==selectedPlace.current))
    )
  },[availablePlaces]);

  return (
    <>
      <Modal isModalOpen={isModalOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
