import 'isomorphic-fetch'
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { expect } from 'chai';
import * as actions from '../../../app/actions/student';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('student actions', () => {
  const student = {
    firstName: 'Sammy',
    lastName: 'Tester',
    email: 'stester@gmail.com',
    age: 9,
    grade: 4
  };

  afterEach(() => {
    fetchMock.restore();
  });

  it('creates STUDENT_ADD_SUCCESS action when form is submitted', () => {
    fetchMock.mock('/student', 'POST', { student });

    const expectedActions = [
      { type: 'CLEAR_MESSAGES' },
      { type: 'STUDENT_ADD_SUCCESS', messages: [{ msg: 'Student added successfully' }], student: student }
    ];

    const store = mockStore({});

    return store.dispatch(actions.addStudent(student.firstName, student.lastName, student.email, student.age, student.grade))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });
});
