# Hooks

These hooks will be used to create our own custom hooks and to write the logic for the same

hooks usually starts with the keyword use

# Axios requests and catch  block 
when we hit the axios request and server returns an error it goes to catch block and is not handled by the try block after that (also error usually lies in the error.response  => ?.message/?.status/?.data) whatever your backend serves

# Fetch
Never throws error for HTTP status codes

It only throws error for network failures (no internet, DNS failure, CORS crash, etc.)

# Redux 
we use redux for the state management

### step 1 :
in step 1 we create store , store usually contains the slices like the user slice for storing the data of users, shop slices to store data for the owners of the shop and so on.
to hm store pe jaenge and data ko access kr lenge whenever needed.

### step 2
all the data will be stored in these slices only. Means hmara jitna bhi data h vo hm slices me rkhenge and fir sari slices lekr usko store me daal denge and we will access this store using the provider in the base of app

# UseEffect
we can use the useEffect hook whenever we have custom hooks to call orthe fuctions jinko baari baari call ni krna 

# API FOR GETTING CITY NAME
Geoapify => helps in retrieving the location of the user 


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
