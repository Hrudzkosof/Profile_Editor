// Initial state for the profile, retrieved from localStorage if available, 
// otherwise defaults to an empty profile object.
const initialState = (() => {
  const savedProfile = localStorage.getItem("profile");
  return savedProfile ? JSON.parse(savedProfile) : {
    name: '',
    lastname: '',
    jobTitle: '',
    phone: '',
    email: '',
    address: '',
    pitch: '',
    interests: [],
    links: [],
    avatar: null,
    profileVisibility: 'Private',
  };
})();

// Reducer function to manage the profile state
export const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.payload.field]: action.payload.value };
    case 'SET_AVATAR':
      return { ...state, avatar: action.payload };
    case 'RESET_PROFILE':
      return initialState;
    default:
      return state;
  }
};

// Action to set the avatar image
export const setAvatar = (avatar) => ({
  type: 'SET_AVATAR',
  payload: avatar,
});

// Action to reset the profile to its default state
export const resetProfile = () => ({
  type: 'RESET_PROFILE',
});

// Action to update a specific field in the profile
export const setField = (field, value) => ({
  type: 'SET_FIELD',
  payload: { field, value },
});
