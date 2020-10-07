import React, { useEffect, useContext } from "react";
import ShowLikedAnimals from "../ShowLikedAnimals/ShowLikedAnimals.jsx";
import Animal from "./Animal";
import { getFilteredAnimal } from "./filters/filter";
import { updateUser } from "../../components/database/FirebaseOperationsUser";
import { loadAllAnimals } from "../../components/database/FirebaseOperationsAnimals";
import { filterAllAnimals } from "./filters/filter";

import SheltersContext from "../../data/context/shelters.context";
import AnimalsContext from "../../data/context/animals.context";
import UserContext from "../../data/context/user.context";

function LikeSystem() {
  const { shelters } = useContext(SheltersContext.store);
  const { animals, setAnimals, allAnimals, setAllAnimals } = useContext(
    AnimalsContext.store
  );
  const { user, setUser } = useContext(UserContext.store);

  useEffect(() => {
    loadAllAnimals({ setAllAnimals, setAnimals });
  }, []);

  useEffect(() => {
    console.log("nowe filtry !!!!");
    console.log(user);
    filterAllAnimals({ allAnimals, user, setAnimals, shelters });
  }, [user]);

  useEffect(() => {
    shuffleArray(animals);
  }, [animals]);

  const removedAnimalFromDataSrc = (animalSource, animalId) =>
    animalSource.filter((animal) => animal.id !== animalId);

  const modifySuperficialChoices = (animal, action) => {
    const newUser = { ...user };
    const animalId = animal.id;

    switch (action) {
      case "ADD_TO_LIKED_USER":
        if (!user.likedAnimals.includes(animal)) {
          newUser.likedAnimals.push(animal);
          newUser.viewedAnimals.push(animalId);
          setAnimals(removedAnimalFromDataSrc(animals, animalId));
        }
        break;
      case "ADD_TO_NEXT_USER":
        if (!user.nextAnimals.includes(animal)) {
          newUser.nextAnimals.push(animal);
          newUser.viewedAnimals.push(animalId);
          setAnimals(removedAnimalFromDataSrc(animals, animalId));
        }
        break;
      case "REWIND":
        if (user.nextAnimals.length > 0) {
          const newAnimals = [...animals];
          const lastAnimal = user.nextAnimals[user.nextAnimals.length - 1];
          newUser.nextAnimals.pop();
          newUser.viewedAnimals.pop();
          newAnimals.unshift(lastAnimal);
          setAnimals(newAnimals);
        }
        break;
      default:
        return animals;
    }

    console.log(`Animals left: ${animals.length}`);
    console.log(animals);
    console.log("User  details:");
    console.log(user);

    setUser(newUser);
    if (user.id !== null) updateUser(newUser);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const nextAnimal = getFilteredAnimal(animals, user, setUser);

  return (
    <div>
      {nextAnimal ? (
        <>
          <Animal
            key={nextAnimal.id}
            animal={nextAnimal}
            modifySuperficialChoices={modifySuperficialChoices}
          />
        </>
      ) : (
        <ShowLikedAnimals />
      )}
    </div>
  );
}

export default React.memo(LikeSystem);