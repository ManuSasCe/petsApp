# Initial Technical Decisions

## Technology Stack

### React 18
- Chosen for familiarity and stability
- React 19 not used to avoid potential incompatibilities and reduce learning curve in this initial phase

### Flowbite + Tailwind CSS
- Implemented to maintain visual consistency throughout the application
- Provide predefined components that accelerate development
- Offer flexibility for customization according to project needs

## Service Architecture

### Endpoint Management
- Single centralized file for services (currently only 2 endpoints)
- Ready to be split into multiple files if complexity increases

### Fetch vs Axios
- Native Fetch used for simplicity and sufficiency for current requirements
- Possible migration to Axios if the need arises for (or if i have time):
  - Interceptors for centralized error/authentication handling
  - Request cancellation
  - Automatic data transformation
  - Configurable timeouts

### Filter Persistence

- Filter Persistence
- To keep filters active when navigating between pages or reloading the application, a Zustand-based solution was implemented. This choice offers:

  - It allows me to reset everything easier.
  - Even if you exit the browser the state is still maintained.
  - It is easier to maintain

- Why not use parameters in the URL?
  - I started to implement it, but I honestly felt that having Zustand installed made everything easier and simpler.

### Pet of the day
- I use Zustand to manage the "Pet of the Day" feature makes it easy to maintain and ensures that the state persists across page navigations and browser reloads. Share reasons with filter persistence

- Update Logic:

  - If there's no "Pet of the Day" stored, a new one is selected.
  - If the stored date doesn't match the current date (i.e., the day has changed), a new "Pet of the Day" is selected.
- how work the "Pet of the Day"
  - Seed Calculation: We sum the year, month, and day to create a seeed (For example, for April 11, 2025, the seed is 2025 + 4 + 11 = 2040)
  - Index Selection: Using the modulo operator (%) (at the end I used it, uni calculus professor), we get an index within the range of the pets array length: randomIndex = seed % allPets.length.
  - this method isn't truly random, it ensures a different "Pet of the Day" each day. All users see the same pet on a given day, which wouldn't be possible with a completely random number.