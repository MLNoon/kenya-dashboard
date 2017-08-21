import * as Cookies from 'js-cookie';
import { post } from 'utils/request';

// CONSTANTS
const SET_USER = 'SET_USER';
const REMOVE_USER = 'REMOVE_USER';
const RESET_PASSWORD = 'RESET_PASSWORD';

const userCookie = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};

// REDUCER
const initialState = {
  user: userCookie,
  logged: userCookie && userCookie.auth_token && userCookie.auth_token !== '',
  reset: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return Object.assign({}, state, { user: action.payload.user, logged: action.payload.logged });
    case REMOVE_USER:
      return Object.assign({}, state, { user: {}, logged: false });
    case RESET_PASSWORD:
      return Object.assign({}, state, { reset: action.payload });
    default:
      return state;
  }
}


// ACTIONS
export function setUser(user) {
  return { type: SET_USER, payload: user };
}

export function login({ email, password }) {
  return (dispatch) => {
    post({
      url: `${process.env.KENYA_API}/auth`,
      type: 'POST',
      body: { email, password },
      headers: [
        {
          key: 'Content-Type',
          value: 'application/json'
        }
      ],
      onSuccess: (response) => {
        localStorage.setItem('token', response.auth_token);
        // Set cookie
        Cookies.set('user', JSON.stringify(response));
        // Dispatch action
        dispatch({ type: SET_USER, payload: { user: response, logged: true } });
      },
      onError: () => {
        localStorage.setItem('token', '');
        dispatch({ type: SET_USER, payload: { user: {}, logged: false } });
      }
    });
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.setItem('token', '');
    // Set cookie
    Cookies.remove('user');

    // Dispatch action
    dispatch({ type: REMOVE_USER });
  };
  // return dispatch => new Promise((resolve, reject) => {
  //   post({
  //     url: `${process.env.KENYA_API}/logout`,
  //     type: 'POST',
  //     body: {},
  //     headers: [{
  //       key: 'Content-Type',
  //       value: 'application/json'
  //     }, {
  //       key: 'KENYA-API-KEY',
  //       value: process.env.KENYA_API_KEY
  //     }],
  //     onSuccess: (response) => {
  //       // Set cookie
  //       Cookies.remove('user');
  //
  //       // Dispatch action
  //       dispatch({ type: SET_USER, payload: {} });
  //
  //       resolve(response);
  //     },
  //     onError: (error) => {
  //       reject(error);
  //     }
  //   });
  // });
}

export function resetPassword(email) {
  return (dispatch) => {
    // post({
    //   url: `${process.env.KENYA_API}/reset`,
    //   type: 'POST',
    //   body: { email },
    //   headers: [
    //     {
    //       key: 'Content-Type',
    //       value: 'application/json'
    //     }
    //   ],
    //   onSuccess: (data) => {
    //     // Dispatch action
    //     dispatch({ type: RESET_PASSWORD, payload: data });
    //   },
    //   onError: (err) => {
    //     dispatch({ type: RESET_PASSWORD, payload: { error: err } });
    //   }
    // });

    // Provisional
    dispatch({ type: RESET_PASSWORD, payload: { error: 'err' } });
  };
}