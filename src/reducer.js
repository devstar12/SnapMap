export const reducer = (prevState, action) => {
    switch (action.type) {
      case 'TO_SIGNUP_PAGE':
        return {
          ...prevState,
          isLoading: false,
          isSignedUp: false,
          noAccount: true,
        };
      case 'TO_SIGNIN_PAGE':
        return {
          ...prevState,
          isLoading: false,
          isSignedIn: false,
          noAccount: false,
        };

      case 'SIGNED_UP':
        return {
          ...prevState,
          isSignedIn: false,
          isSignedUp: true,
          isLoading: false,
        };
      case 'SIGN_IN':
        return {
          ...prevState,
          isLoading: false,
          isSignedOut: false,
          isSignedIn: true,
          isSignedUp: false,
        };
      case 'SIGN_OUT':
        return {
          ...prevState,
          isSignedOut: true,
          isLoading: false,
          isSignedIn: false,
          noAccount: false,
        };
    }
  };
  
  export const initialState = {
    isLoading: true,
    isSignedOut: false,
    isSignedUp: false,
    noAccount: false,
    isSignedIn: false,
  };