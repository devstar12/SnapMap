export const stateConditionString = state => {
    let navigateTo = '';
    if (state.isLoading) {
        navigateTo = 'LOAD_APP';
        return navigateTo;
    }
    if (state.isSignedIn) {
        navigateTo = 'LOAD_HOME';
    }
    if (!state.isSignedUp && state.noAccount) {
        navigateTo = 'LOAD_SIGNUP';
    }
    if (!state.isSignedIn && !state.noAccount) {
        navigateTo = 'LOAD_SIGNIN';
    }
    return navigateTo;
};