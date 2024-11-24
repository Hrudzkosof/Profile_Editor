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

// Редьюсер для управления состоянием профиля
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

// Действия для редьюсера
export const setAvatar = (avatar) => ({
  type: 'SET_AVATAR',
  payload: avatar,
});

export const resetProfile = () => ({
  type: 'RESET_PROFILE',
});

export const setField = (field, value) => ({
  type: 'SET_FIELD',
  payload: { field, value },
});
