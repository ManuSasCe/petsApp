// src/__tests__/mocks/petMocks.ts

import { Pet, Cat, Dog } from "../../types";

// --- Valid Mocks ---

export const validCatMock: Cat = {
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

export const validDogMock: Dog = {
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
        weight: 5000, 
        height: 30,
        length: 50,
        photo_url: "https://beautifulCats.com/buddy3.jpg",
        description: "An amazing and loyal and friendly cat",
        number_of_lives: 7, 
      },
      {
        id: 4,
        name: "Buddy4",
        kind: "dog", // Es Dog
        weight: 22000,
        height: 65,
        length: 95,
        photo_url: "https://beautifulCats.com/buddy4.jpg",
        description: "A super loyal and friendly dog",
      },
      {
        id: 5,
        name: "Buddy5",
        kind: "cat", 
        weight: 4000, 
        height: 28,
        length: 48,
        photo_url: "https://beautifulCats.com/buddy5.jpg",
        description: "A magic and loyal and friendly dog (or maybe is a cat)",
        number_of_lives: 2, 
      }
  ];

// --- No Valid Mocks ---

export const invalidNegativeWeightMock: Cat = { 
  ...validCatMock,
  weight: -666
};

export const invalidNegativeHeightMock: Cat = { 
  ...validCatMock,
  height: -1
};

export const invalidNegativeLengthMock: Cat = { 
  ...validCatMock,
  length: -1
};

