const initialState = {
    projectFiles: JSON.parse(localStorage.getItem('projectFiles')) || [],
    taskFiles: JSON.parse(localStorage.getItem('taskFiles')) || [],
  };
  
  // Action types
  const ADD_PROJECT_FILES = 'ADD_PROJECT_FILES';
  const ADD_TASK_FILES = 'ADD_TASK_FILES';
  
  // Reducer
  export default function filesReducer(state = initialState, action) {
    switch (action.type) {
      case ADD_PROJECT_FILES:
        const updatedProjectFiles = [...state.projectFiles, ...action.payload];
        localStorage.setItem('projectFiles', JSON.stringify(updatedProjectFiles)); // Sync with localStorage
        return { ...state, projectFiles: updatedProjectFiles };
  
      case ADD_TASK_FILES:
        const updatedTaskFiles = [...state.taskFiles, ...action.payload];
        localStorage.setItem('taskFiles', JSON.stringify(updatedTaskFiles)); // Sync with localStorage
        return { ...state, taskFiles: updatedTaskFiles };
  
      default:
        return state;
    }
  }
  
  // Action creators
  export const addProjectFiles = (files) => ({
    type: ADD_PROJECT_FILES,
    payload: files,
  });
  
  export const addTaskFiles = (files) => ({
    type: ADD_TASK_FILES,
    payload: files,
  });
  