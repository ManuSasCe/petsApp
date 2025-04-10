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