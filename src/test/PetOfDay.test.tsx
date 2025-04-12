import React from 'react';
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PetOfDay from "../components/PetOfDay"; 
import { usePetOfTheDay } from "../utils/petOfDayUtils"; 
import { calculatePetHealth } from "../utils/healthUtils"; 
import { validCatMock, validDogMock } from './__mocks__/petMocks'; 

// --- Mock react-i18next ---
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => {
        if (str === 'pet_day.title') return 'Pet of the Day';
        if (str === 'pet_day.loading') return 'Loading pet of the day'; // aria-label content
        if (str === 'detail.weight') return 'Weight';
        if (str === 'detail.height') return 'Height';
        if (str === 'detail.length') return 'Length';
        if (str === 'pet_day.error') return 'We have no pet of the day, try again in a few minutes!!';
        return str;
      },
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));
// --- End of Mock ---

// Mock the custom hooks used by the component
jest.mock("../utils/petOfDayUtils", () => ({
  usePetOfTheDay: jest.fn(),
}));

jest.mock("../utils/healthUtils", () => ({
  calculatePetHealth: jest.fn(),
}));

// Helper function to render components needing React Router context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe("PetOfDay Component", () => {
  // Clear all mocks before each test to ensure isolation
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1. renders nothing when there are no pets passed", () => {
    // Setup: Mock the hook to return null (though it might not even be called)
    (usePetOfTheDay as jest.Mock).mockReturnValue(null);
    // Action: Render the component with no pets
    renderWithRouter(<PetOfDay allPets={[]} />);

    // Action: Render the component with an empty allPets array
    expect(screen.getByText("We have no pet of the day, try again in a few minutes!!")).toBeInTheDocument();
  });

  test("2. shows a spinner when pets exist but pet of the day is not yet determined", () => {
    // Setup: Mock the hook to return null, simulating loading state
    (usePetOfTheDay as jest.Mock).mockReturnValue(null);
    // Action: Render the component with some pets
    renderWithRouter(<PetOfDay allPets={[validCatMock]} />);

    // Assertion: Check for the title 
    expect(screen.getByText("Pet of the Day")).toBeInTheDocument();
    // Assertion: Check for the spinner using its aria-label 
    expect(screen.getByLabelText("Loading pet of the day")).toBeInTheDocument();
  });

  test("3. renders cat pet of the day correctly with details", () => {
    // Setup: Mock the hook to return a specific cat pet
    (usePetOfTheDay as jest.Mock).mockReturnValue(validCatMock);
    // Setup: Mock the health calculation to return a value
    (calculatePetHealth as jest.Mock).mockReturnValue("healthy"); // Or any status

    // Action: Render the component
    renderWithRouter(<PetOfDay allPets={[validCatMock]} />);

    // --- Assertions ---
    // Check for the title
    expect(screen.getByText("Pet of the Day")).toBeInTheDocument();
    // Check for the pet's name
    expect(screen.getByText(validCatMock.name)).toBeInTheDocument();
     // Check for the pet's kind (using partial match because it's inside a Badge)
    expect(screen.getByText(validCatMock.kind, { exact: false })).toBeInTheDocument();
    // Check for weight, height, length (using partial match due to units/labels)
    // Note: We use the mocked translation for labels like "Weight" here implicitly
    expect(screen.getByText(`${validCatMock.weight} g`, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(`${validCatMock.height} cm`, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(`${validCatMock.length} cm`, { exact: false })).toBeInTheDocument();

    // Check the image presence and attributes
    const image = screen.getByAltText(validCatMock.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", validCatMock.photo_url);

    // Check that the component links to the pet's detail page
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/pet/${validCatMock.id}`);

    // Check if calculatePetHealth was called with the correct pet
    expect(calculatePetHealth).toHaveBeenCalledWith(validCatMock);
  });

  test("4. renders dog pet of the day correctly with details", () => {
    // Setup: Mock the hook to return a specific dog pet
    (usePetOfTheDay as jest.Mock).mockReturnValue(validDogMock);
    // Setup: Mock the health calculation
    (calculatePetHealth as jest.Mock).mockReturnValue("unhealthy"); // Example status

    // Action: Render the component
    renderWithRouter(<PetOfDay allPets={[validDogMock]} />);

    // --- Assertions ---
    // Check for the title
    expect(screen.getByText("Pet of the Day")).toBeInTheDocument();
    // Check for the pet's name
    expect(screen.getByText(validDogMock.name)).toBeInTheDocument();
    // Check for kind, weight, height, length
    expect(screen.getByText(validDogMock.kind, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(`${validDogMock.weight} g`, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(`${validDogMock.height} cm`, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(`${validDogMock.length} cm`, { exact: false })).toBeInTheDocument();

    // Check the image
    const image = screen.getByAltText(validDogMock.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", validDogMock.photo_url);

    // Check the link
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/pet/${validDogMock.id}`);

     // Check if calculatePetHealth was called
    expect(calculatePetHealth).toHaveBeenCalledWith(validDogMock);
  });

});
