import React, { useEffect, useState, useContext } from "react";
import LikedAnimalShelterMap from "./LikedAnimalShelterMap/LikedAnimalShelterMap";
import { getDistanceBetweenPoints } from "../LikeSystem/calculateDistance";

import SheltersContext from "../../data/context/shelters.context";
import AnimalsContext from "../../data/context/animals.context";
import UserContext from "../../data/context/user.context";

const ShowAnimalDetails = ({ animalId }) => {
  const [animal, setAnimal] = useState({});
  const [shelter, setShelter] = useState({});
  const [distance, setDistance] = useState("(Wpisz swoją lokalizację)");

  const { shelters } = useContext(SheltersContext.store);
  const { animals } = useContext(AnimalsContext.store);
  const { user } = useContext(UserContext.store);

  console.log(animalId);

  useEffect(() => {
    setAnimalByAnimalId();
  }, []);

  useEffect(() => {
    setShelterByAnimalId();
  }, [animal]);

  useEffect(() => {
    const newDistance = getDistanceBetweenPoints(user, shelter);
    setDistance(newDistance);
  }, [shelter]);

  const setAnimalByAnimalId = () => {
    animals.forEach((oneAnimal) => {
      if (oneAnimal.id === Number(animalId)) {
        setAnimal(oneAnimal);
      }
    });

    user.likedAnimals.forEach((oneAnimal) => {
      if (oneAnimal.id === Number(animalId)) {
        setAnimal(oneAnimal);
      }
    });
  };

  const setShelterByAnimalId = () => {
    shelters.forEach((oneShelter) => {
      if (oneShelter.id === animal.shelterId) {
        setShelter(oneShelter);
      }
    });
  };

  return (
    <div className="liked-animal">
      <img src={animal.image} alt={`You liked ${animal.name}`} />
      <p>{`Imie: ${animal.name}`}</p>
      <p>{`Wiek: ${animal.age}`}</p>
      <p>{`Płeć: ${animal.gender}`}</p>
      <p>{`Dystans: ${distance}`}</p>
      <p>{`Opis: ${animal.desc}`}</p>

      <LikedAnimalShelterMap shelter={shelter} />
    </div>
  );
};

export default React.memo(ShowAnimalDetails);