const initialState = {
  students: []
};

export default function students(state = initialState, action) {
  if (!state.hydrated) {
    state = Object.assign({}, initialState, state, { hydrated: true });
  }
  switch (action.type) {
    case 'STUDENTS_RETRIEVE_SUCCESS':
      return Object.assign({}, state, {
        students: action.students
      });
    case 'STUDENT_ADD_SUCCESS':
    case 'STUDENT_UPDATE_SUCCESS':
      return Object.assign({}, state, {
        student: action.student
      });
    default:
      return state;
  }
}
