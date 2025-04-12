import React from 'react';
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PetOfDay from "../components/PetOfDay";
import { usePetOfTheDay } from "../utils/PetOfDayUtils";
import { calculatePetHealth } from "../utils/HealthUtils";
import { validCatMock, validDogMock } from './__mocks__/petMocks';
import { Pet } from '../types'; 

// --- Mock react-i18next ---
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string, options?: { name?: string, kind?: string }) => {
        // Map keys to simple strings for the test
        const map: Record<string, string> = {
          'pet_day.title': 'Pet of the Day',
          'pet_day.loading': 'Loading pet of the day',
          'pet_day.error': 'We have no pet of the day, try again in a few minutes!!',
          'detail.weight': 'Weight',
          'detail.height': 'Height',
          'detail.length': 'Length',
          'pet_types.cat': 'Cat', 
          'pet_types.dog': 'Dog',  
          'No valid photo': `No valid photo for ${options?.name}`, 
        };
        return map[str] || str; 
      },
      i18n: {
        changeLanguage: () => new Promise(() => {}),
        language: 'en', // Provide a default language
      },
    };
  },
}));
// --- End of i18n Mock ---

jest.mock("../utils/petOfDayUtils", () => ({
  usePetOfTheDay: jest.fn(),
}));

jest.mock("../utils/healthUtils", () => ({
  calculatePetHealth: jest.fn(),
}));

// Mock the child component responsible for image loading complexity
jest.mock("../components/utils/BlurredImageBackgroundCard", () => {
    // Define the props structure for type safety inside the mock
    interface MockBlurredImageProps {
        pet: Pet;
        className?: string;
    }
    // Return a simple functional component mock
    return ({ pet }: MockBlurredImageProps) => (
        <img
            src={pet.photo_url}
            alt={pet.name} // Simple alt text for testing, i18n is tricky here
            data-testid={`blurred-img-${pet.id}`} 
        />
    );
});
// --- End of BlurredImageBackgroundCard Mock ---

// Mock HealthBadge if it has complex logic or makes tests fail
jest.mock("../components/utils/HealthBadge", () => {
    return ({ status }: { status: string }) => (
        <span data-testid="health-badge">{`Health: ${status}`}</span>
    );
});


// Helper function to render components needing React Router context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe("PetOfDay Component", () => {
  // Clear all mocks before each test to ensure isolation
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("1. renders error message when there are no pets passed", () => {
    // Setup: Hook might not be called, but ensure it returns null if called
    (usePetOfTheDay as jest.Mock).mockReturnValue(null);

    // Action: Render the component with an empty allPets array
    renderWithRouter(<PetOfDay allPets={[]} />);

    // Assertion: Check for the specific error message rendered by PetOfDay
    expect(screen.getByText("We have no pet of the day, try again in a few minutes!!")).toBeInTheDocument();
    // Ensure spinner or pet card details are NOT present
    expect(screen.queryByLabelText("Loading pet of the day")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });


  test("2. shows a spinner when pets exist but pet of the day is not yet determined", () => {
    // Setup: Mock the hook to return null, simulating loading state
    (usePetOfTheDay as jest.Mock).mockReturnValue(null);

    // Action: Render the component with some pets
    renderWithRouter(<PetOfDay allPets={[validCatMock]} />); 

    // Assertion: Check for the title
    expect(screen.getByText("Pet of the Day")).toBeInTheDocument();
    // Assertion: Check for the spinner using its aria-label (defined in PetOfDay JSX)
    expect(screen.getByLabelText("Loading pet of the day")).toBeInTheDocument();
    // Ensure error message or pet card details are NOT present
    expect(screen.queryByText("We have no pet of the day, try again in a few minutes!!")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });


  test("3. renders cat pet of the day correctly using PetCard", async () => { // Mark as async if using findBy* or waitFor
    // Setup: Mock the hook to return a specific cat pet
    (usePetOfTheDay as jest.Mock).mockReturnValue(validCatMock);
    // Setup: Mock the health calculation to return a value
    const mockHealthStatus = "healthy";
    (calculatePetHealth as jest.Mock).mockReturnValue(mockHealthStatus);

    // Action: Render the component
    renderWithRouter(<PetOfDay allPets={[validCatMock]} />);

    // --- Assertions ---
    // Check for the PetOfDay title
    expect(screen.getByText("Pet of the Day")).toBeInTheDocument();

    // --- Assertions targeting content rendered by PetCard ---
    // Check for the pet's name (likely within an h5)
    expect(screen.getByRole('heading', { name: validCatMock.name })).toBeInTheDocument();
    // Check for the pet's kind (using the mocked translation 'Cat')
    expect(screen.getByText("Cat")).toBeInTheDocument(); // Check badge text
    // Check for weight, height, length (using getByText with exact: false or regex if needed)
    expect(screen.getByText(`${validCatMock.weight} g`, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(`${validCatMock.height} cm`, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(`${validCatMock.length} cm`, { exact: false })).toBeInTheDocument();

    // Check the image rendered by the MOCKED BlurredImageBackgroundCard
    // The mock renders a simple <img> with alt={pet.name}
    const image = screen.getByAltText(validCatMock.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", validCatMock.photo_url);

    // Check that the PetCard component links to the pet's detail page
    const link = screen.getByRole("link"); // PetCard wraps everything in a Link
    expect(link).toHaveAttribute("href", `/pet/${validCatMock.id}`);

    // Check if calculatePetHealth was called by PetCard
    expect(calculatePetHealth).toHaveBeenCalledWith(validCatMock);

    // Check for the mocked HealthBadge content
    expect(screen.getByTestId("health-badge")).toHaveTextContent(`Health: ${mockHealthStatus}`);

    // Ensure loading spinner and error message are not present
    expect(screen.queryByLabelText("Loading pet of the day")).not.toBeInTheDocument();
    expect(screen.queryByText("We have no pet of the day, try again in a few minutes!!")).not.toBeInTheDocument();
  });

  // Test 4 (for dog) would be very similar to Test 3, just using validDogMock
  test("4. renders dog pet of the day correctly using PetCard", () => {
     // Setup
    (usePetOfTheDay as jest.Mock).mockReturnValue(validDogMock);
    const mockHealthStatus = "unhealthy";
    (calculatePetHealth as jest.Mock).mockReturnValue(mockHealthStatus);

    // Action
    renderWithRouter(<PetOfDay allPets={[validDogMock]} />);

     // Assertions (similar to test 3, checking dog details)
    expect(screen.getByText("Pet of the Day")).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: validDogMock.name })).toBeInTheDocument();
    expect(screen.getByText("Dog")).toBeInTheDocument(); // Mocked translation
    expect(screen.getByText(`${validDogMock.weight} g`, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(`${validDogMock.height} cm`, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(`${validDogMock.length} cm`, { exact: false })).toBeInTheDocument();

    const image = screen.getByAltText(validDogMock.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", validDogMock.photo_url);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/pet/${validDogMock.id}`);

    expect(calculatePetHealth).toHaveBeenCalledWith(validDogMock);
    expect(screen.getByTestId("health-badge")).toHaveTextContent(`Health: ${mockHealthStatus}`);

    expect(screen.queryByLabelText("Loading pet of the day")).not.toBeInTheDocument();
    expect(screen.queryByText("We have no pet of the day, try again in a few minutes!!")).not.toBeInTheDocument();
  });

});
