// src/__tests__/mocks/petMocks.ts

import { Pet } from "../../types";


export const validCatMock: Pet = {
  id: 1,
  name: "Zelda",
  kind: "cat",
  weight: 3500,
  height: 25,
  length: 45,
  photo_url: "https://beautifulCats.com/Zelda.jpg",
  description: "My cat",
  number_of_lives: 9,
};

export const validDogMock: Pet = {
  id: 2,
  name: "Liara",
  kind: "dog",
  weight: 20000,
  height: 60,
  length: 90,
  photo_url: "https://beautifulCats.com/Liara.jpg",
  description: "My second cat, but i need a dog mock =(",
};


export const mockPets: Pet[] = [
    {
        id: 1,
        name: "Buddy",
        kind: "dog",
        weight: 20000,
        height: 60,
        length: 90,
        photo_url: "https://beautifulCats.com/buddy.jpg",
        description: "A loyal and friendly dog",
      },
      {
        id: 2,
        name: "Buddy2",
        kind: "dog",
        weight: 20000,
        height: 60,
        length: 90,
        photo_url: "https://beautifulCats.com/buddy2.jpg",
        description: "A very loyal and friendly dog",
      },
      {
        id: 3,
        name: "Buddy3",
        kind: "cat",
        weight: 20000,
        height: 60,
        length: 90,
        photo_url: "https://beautifulCats.com/buddy3.jpg",
        description: "An amazing and loyal and friendly cat",
      },
      {
        id: 4,
        name: "Buddy4",
        kind: "dog",
        weight: 20000,
        height: 60,
        length: 90,
        photo_url: "https://beautifulCats.com/buddy4.jpg",
        description: "A super loyal and friendly dog",
      },
      {
        id: 5,
        name: "Buddy5",
        kind: "cat",
        weight: 20000,
        height: 60,
        length: 90,
        photo_url: "https://beautifulCats.com/buddy5.jpg",
        description: "A magic and loyal and friendly dog (or maybe is a cat)",
      }
  ] as Pet[];


// Invalid mocks 

export const invalidDogWithLivesMock: Pet = {
  ...validDogMock,
  number_of_lives: 1 // Dogs shouldn't have number_of_lives
};

export const invalidCatWithoutLivesMock: Pet = {
  ...validCatMock,
  number_of_lives: undefined // Cats should have number_of_lives
};

export const invalidNegativeWeightMock: Pet = {
  ...validCatMock,
  weight: -666 // Pets can not have negative weight
};

export const invalidNegativeHeightMock: Pet = {
  ...validCatMock,
  height: -1 // Pets can not have negative height
};

export const invalidNegativeLengthMock: Pet = {
  ...validCatMock,
  length: -1 // Pets can not have negative length
};