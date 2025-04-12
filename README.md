# Initial Technical Decisions

## Technology Stack

### React 18
- Chosen for familiarity and stability
- React 19 not used to avoid potential incompatibilities and reduce learning curve in this initial phase. I tried to update to react 19, but i found some issues with flowbite.

### Flowbite + Tailwind CSS
- Implemented to maintain visual consistency throughout the application
- Provide predefined components that accelerate development
- Offer flexibility for customization according to project needs
- I feel confortable with this component library.

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
- I was a little confused about this “algorithm”. Maybe it was simple and deterministic. The reality is that it is not a random number. I spent some time to think about this. 
Maybe I can use a random function to get a real random number. But I think the best solution (the best solution, I think, is a backend return pet of the day) is to have a “random” number that all users can have the same pet of the day. It's fair for all the beautiful pets we have in this app.

### About Testing
- I decided to use Jest to test this application. Since it was my first time testing the frontend, I tried to be specific and focus on testing the most important things (thanks to google, leChat AI and dev.to for helping me with this), so i needed help to understand and create my first tests. To be honest, i needed to think to create this tests, so i saw a lot of examples and ideas from diferents sources, im happy to said that i lose the fear to test in front side =) . I had several issues related to react-router V-7 and Jest. I got stuck with a problem related to an error between React-Router and Jest (TextEncoder error), but after some time (may be too long) the error was fixed. 
- I use Jest just for comfort. I know it exists and I see a lot of documentation about Jest + React.

### About blurred Image componente
- When I was checking the application I saw that some pets did not have a correct image. We have a pet with an image with .jp (not .jpg and not the Japanese web extension was allowed in a image file!). 
So I decided to change the way we (not) atacked this situation. 
I created a new component (that we can use in the pet tab and in the detail page) to check if the image has the “typical” image extension on the web page. And if the url does not contain this extension... we print an icon with a small message.
Another problem I see is that we don't have a normalized aspect ratio, so I decided to add in this component the image twice. One blurred and deformed in the backend, filling all the space I give it, and above the real image. 
As the github text says, this app is going to have tons of pets, but with the image cache this is not going to be a problem!


### Improvements!
- I know I don't cover the whole application with the test, I just think it's a technical test and I don't have more time. But in a real situation, it is perfect (and preferable) to cover as many cases as possible.
- Maybe I could have a better architecture, I have used the ‘typical’ react architecture, I think this is a small application and I prefer to have a simple architecture