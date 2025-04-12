// src/__tests__/usePetOfTheDay.test.ts

import { renderHook } from '@testing-library/react';
import { usePetOfDay, usePetOfDayActions, useLastUpdated } from '../stores/petStore';
import { usePetOfTheDay } from '../utils/PetOfDayUtils';
import { mockPets } from './__mocks__/petMocks';

// Mock the store hooks
jest.mock('../stores/petStore', () => ({
  usePetOfDay: jest.fn(),
  usePetOfDayActions: jest.fn(),
  useLastUpdated: jest.fn(),
}));

// Mock the getDailySeed function to control the date
const originalDateNow = Date.now;

describe('usePetOfTheDay', () => {
  const mockSetPetOfDay = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (usePetOfDayActions as jest.Mock).mockReturnValue({ setPetOfDay: mockSetPetOfDay });
  });

  afterAll(() => {
    // Restore original Date functionality
    global.Date.now = originalDateNow;
  });

  test('should return null when there are no pets', () => {
    (usePetOfDay as jest.Mock).mockReturnValue(null);
    (useLastUpdated as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => usePetOfTheDay([]));
    
    expect(result.current).toBeNull();
    expect(mockSetPetOfDay).not.toHaveBeenCalled();
  });

  test('should set a new pet of the day when there is no current pet', () => {
    // Mock that there's no current pet
    (usePetOfDay as jest.Mock).mockReturnValue(null);
    (useLastUpdated as jest.Mock).mockReturnValue(null);
    
    // Get today's date string
    const today = new Date().toISOString().split('T')[0];
    
    // Render the hook
    renderHook(() => usePetOfTheDay(mockPets));
    
    // Verify setPetOfDay was called with a pet from the mockPets array
    expect(mockSetPetOfDay).toHaveBeenCalled();
    
    // Check that the first argument is one of the mock pets
    const selectedPet = mockSetPetOfDay.mock.calls[0][0];
    expect(mockPets).toContainEqual(selectedPet);
    
    // Check that the second argument is today's date
    expect(mockSetPetOfDay.mock.calls[0][1]).toBe(today);
  });

  test('should set a new pet of the day when the date has changed', () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Mock yesterday's date
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    // Mock that we have a pet from yesterday
    const yesterdayPet = mockPets[0];
    (usePetOfDay as jest.Mock).mockReturnValue(yesterdayPet);
    (useLastUpdated as jest.Mock).mockReturnValue(yesterdayString);

    // Render the hook
    renderHook(() => usePetOfTheDay(mockPets));
    
    // Verify setPetOfDay was called
    expect(mockSetPetOfDay).toHaveBeenCalled();
    
    // Verify that the second argument is today's date
    expect(mockSetPetOfDay.mock.calls[0][1]).toBe(todayString);
    
    // Get the selected pet
    const selectedPet = mockSetPetOfDay.mock.calls[0][0];
    
    // Calculate which pet should be selected based on today's date
    const todaySeed = todayString.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    const todayIndex = Math.abs(todaySeed) % mockPets.length;
    
    // Calculate which pet should have been selected yesterday
    const yesterdaySeed = yesterdayString.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    const yesterdayIndex = Math.abs(yesterdaySeed) % mockPets.length;
    
    // If the indices are different, the pets should be different
    if (todayIndex !== yesterdayIndex) {
      expect(selectedPet).not.toEqual(yesterdayPet);
    }
    
    // Verify that the selected pet matches our expectation based on today's date
    expect(selectedPet).toEqual(mockPets[todayIndex]);
  });

  test('should not change the pet of the day if the date hasn\'t changed', () => {
    const today = new Date().toISOString().split('T')[0];
    const currentPet = mockPets[1];

    (usePetOfDay as jest.Mock).mockReturnValue(currentPet);
    (useLastUpdated as jest.Mock).mockReturnValue(today);

    const { result } = renderHook(() => usePetOfTheDay(mockPets));
    
    // Verify setPetOfDay was NOT called
    expect(mockSetPetOfDay).not.toHaveBeenCalled();
    
    // Verify that the hook returns the current pet
    expect(result.current).toEqual(currentPet);
  });

  test('should select different pets on different days', () => {
    // Use fake timers to control the date
    jest.useFakeTimers();
    
    // Create a mock implementation for setPetOfDay
    const setPetOfDayMock = jest.fn();
    (usePetOfDayActions as jest.Mock).mockReturnValue({ setPetOfDay: setPetOfDayMock });
    (usePetOfDay as jest.Mock).mockReturnValue(null);
    (useLastUpdated as jest.Mock).mockReturnValue(null);

    // Day 1: January 1, 2025
    const day1 = new Date('2025-01-01T12:00:00Z');
    jest.setSystemTime(day1);
    
    // Render the hook for day 1
    renderHook(() => usePetOfTheDay(mockPets));
    
    // Get the pet selected for day 1
    const day1Pet = setPetOfDayMock.mock.calls[0][0];
    const day1Date = setPetOfDayMock.mock.calls[0][1];
    expect(day1Date).toBe('2025-01-01');

    // Day 2: January 2, 2025
    const day2 = new Date('2025-01-02T12:00:00Z');
    jest.setSystemTime(day2);
    
    // Clear the mock to start fresh
    setPetOfDayMock.mockClear();
    (usePetOfDay as jest.Mock).mockReturnValue(null);
    (useLastUpdated as jest.Mock).mockReturnValue(null);
    
    // Render the hook for day 2
    renderHook(() => usePetOfTheDay(mockPets));
    
    // Get the pet selected for day 2
    const day2Pet = setPetOfDayMock.mock.calls[0][0];
    const day2Date = setPetOfDayMock.mock.calls[0][1];
    expect(day2Date).toBe('2025-01-02');

    // Verify that different days select different pets
    expect(day1Pet).not.toEqual(day2Pet);

    // Restore real timers
    jest.useRealTimers();
  });

  test('should consistently select the same pet for a given day', () => {
    // Use fake timers to control the date
    jest.useFakeTimers();
    
    // Create a mock implementation for setPetOfDay
    const setPetOfDayMock = jest.fn();
    (usePetOfDayActions as jest.Mock).mockReturnValue({ setPetOfDay: setPetOfDayMock });
    
    // Set a specific date
    const testDate = new Date('2025-01-01T12:00:00Z');
    jest.setSystemTime(testDate);
    const dateString = '2025-01-01';

    // First render - no pet yet
    (usePetOfDay as jest.Mock).mockReturnValue(null);
    (useLastUpdated as jest.Mock).mockReturnValue(null);
    renderHook(() => usePetOfTheDay(mockPets));
    
    // Get the first selected pet
    const firstSelectedPet = setPetOfDayMock.mock.calls[0][0];
    expect(setPetOfDayMock.mock.calls[0][1]).toBe(dateString);
    
    // Clear the mock
    setPetOfDayMock.mockClear();
    
    // Second render - simulate a different component instance on the same day
    (usePetOfDay as jest.Mock).mockReturnValue(null);
    (useLastUpdated as jest.Mock).mockReturnValue(null);
    renderHook(() => usePetOfTheDay(mockPets));
    
    // Get the second selected pet
    const secondSelectedPet = setPetOfDayMock.mock.calls[0][0];
    expect(setPetOfDayMock.mock.calls[0][1]).toBe(dateString);
    
    // Verify both renders selected the same pet
    expect(secondSelectedPet).toEqual(firstSelectedPet);
    
    // Calculate the expected pet based on the date
    const seed = dateString.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    const expectedIndex = Math.abs(seed) % mockPets.length;
    const expectedPet = mockPets[expectedIndex];
    
    // Verify that the selected pet matches our expectation
    expect(firstSelectedPet).toEqual(expectedPet);
    
    // Restore real timers
    jest.useRealTimers();
  });
});
