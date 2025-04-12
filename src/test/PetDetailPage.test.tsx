import React from 'react';
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Pet } from '../types';
import PetDetailPage from '../pages/PetDetailPage'; 
import { fetchPetById } from "../services/petService";
import { validCatMock, validDogMock } from './__mocks__/petMocks'; 
import { calculatePetHealth } from '../utils/HealthUtils';

// --- Mocks (No changes to mock definitions here) ---
// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate, // ONLY mock useNavigate
}));
// Mock react-toastify
const mockToastError = jest.fn();
jest.mock('react-toastify', () => ({
  toast: {
    error: (message: string) => mockToastError(message),
  },
}));

// Mock fetchPetById service
jest.mock("../services/petService", () => ({
  fetchPetById: jest.fn(),
}));

// Mock calculatePetHealth utility
jest.mock("../utils/healthUtils", () => ({
  calculatePetHealth: jest.fn(),
}));

// Mock react-i18next (aria-label adjusted)
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'buttons.back': 'Back',
        'detail.weight': 'Weight',
        'detail.height': 'Height',
        'detail.length': 'Length',
        'detail.lives_left': 'Lives Left',
        'detail.title': 'About',
        'pet_types.cat': 'Cat',
        'pet_types.dog': 'Dog',
        'messages.loading': 'Loading pet details', // Ensure this matches aria-label
        'errors.pet_not_found': 'Pet not found',
        'buttons.home': 'Return to Home'
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en',
    },
  }),
}));

// Mock child components
jest.mock('../components/Layout', () => ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>);
jest.mock('../components/utils/BlurredImageBackgroundCard', () => ({ pet }: { pet: Pet }) => <img src={pet.photo_url} alt={pet.name} data-testid="blurred-image" />);
jest.mock('../components/utils/HealthBadge', () => ({ status }: { status: string }) => <span data-testid="health-badge">{status}</span>);
// --- End Mocks ---

const renderWithRouter = (initialEntry: string) => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/pet/:id" element={<PetDetailPage />} />
        <Route path="/" element={<div>Home Page Mock</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe("PetDetailPage Component", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    consoleErrorSpy.mockRestore();
  });

  test("1. Displays spinner while loading", () => {
    (fetchPetById as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderWithRouter("/pet/1");
    // Adjusted aria-label if it changed in the i18n mock
    expect(screen.queryByLabelText("Loading pet details")).toBeInTheDocument();
    expect(screen.queryByTestId("layout")).not.toBeInTheDocument();
  });

  test("2. Displays cat pet details correctly on successful load", async () => {
    // fetchPetById now resolves with a 'Cat' type object
    (fetchPetById as jest.Mock).mockResolvedValue(validCatMock);
    const mockHealth = "healthy";
    (calculatePetHealth as jest.Mock).mockReturnValue(mockHealth);

    renderWithRouter("/pet/1");

    expect(await screen.findByRole('heading', { name: validCatMock.name })).toBeInTheDocument();
    expect(screen.queryByLabelText("Loading pet details")).not.toBeInTheDocument();

    expect(screen.getByText("Cat")).toBeInTheDocument();
    expect(screen.getByText(`${validCatMock.weight}g`)).toBeInTheDocument();
    expect(screen.getByText(`${validCatMock.height}cm`)).toBeInTheDocument();
    expect(screen.getByText(`${validCatMock.length}cm`)).toBeInTheDocument();
    expect(screen.getByText(validCatMock.number_of_lives.toString())).toBeInTheDocument();
    expect(screen.getByText(validCatMock.description)).toBeInTheDocument();
    expect(screen.getByTestId("health-badge")).toHaveTextContent(mockHealth);
    expect(screen.getByTestId("blurred-image")).toHaveAttribute('src', validCatMock.photo_url);

    expect(fetchPetById).toHaveBeenCalledWith('1');
    // calculatePetHealth receives the Cat type mock
    expect(calculatePetHealth).toHaveBeenCalledWith(validCatMock);
    expect(mockToastError).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

   test("3. Displays dog pet details and does not show 'Lives Left'", async () => {
    // fetchPetById now resolves with a 'Dog' type object
    (fetchPetById as jest.Mock).mockResolvedValue(validDogMock);
    (calculatePetHealth as jest.Mock).mockReturnValue("unhealthy");

    renderWithRouter("/pet/2");

    expect(await screen.findByRole('heading', { name: validDogMock.name })).toBeInTheDocument();
    expect(screen.getByText("Dog")).toBeInTheDocument();
    expect(screen.queryByText("Lives Left")).not.toBeInTheDocument(); // Still correct
    expect(fetchPetById).toHaveBeenCalledWith('2');
    // calculatePetHealth receives the Dog type mock
    expect(calculatePetHealth).toHaveBeenCalledWith(validDogMock);
    expect(mockToastError).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });



  test("4. Shows error toast and redirects if fetchPetById fails", async () => {
    const errorMessage = "Network Error";
    (fetchPetById as jest.Mock).mockRejectedValue(new Error(errorMessage));
    renderWithRouter("/pet/error-id");
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("we have an error!"); // Ensure this error message matches implementation
    });
    expect(screen.queryByLabelText("Loading pet details")).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /.*/ })).not.toBeInTheDocument();
    jest.advanceTimersByTime(2000); // Ensure timer matches implementation timeout
    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  test("5. Displays 'Pet not found' message if fetchPetById resolves to null", async () => {
    (fetchPetById as jest.Mock).mockResolvedValue(null);
    renderWithRouter("/pet/not-found-id");
    expect(await screen.findByRole("alert")).toHaveTextContent("Pet not found"); // Ensure message matches i18n mock
    expect(screen.queryByLabelText("Loading pet details")).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: "Return to Home" })).toHaveAttribute('href', '/'); // Ensure button text matches i18n mock
    expect(mockToastError).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

});
