import C from "../actions/constant"

const initialState = {
  isFetching: false,
  error: false,
  items: []
}

export function selectMenu(state = { category: "Welcome" }, action) {
  switch(action.type) {
    case C.SELECT_MENU:
      return Object.assign({}, state, {
        category: action.category
      })
    default:
      return state
  }
}

export function lyric(state = initialState, action) {
  switch(action.type) {
    case C.REQUEST_LYRIC:
      return Object.assign({}, state, {
        isFetching: action.isFetching
      })
    case C.RECEIVE_LYRIC:
      return Object.assign({}, state, {
        isFetching: action.isFetching,
        error: action.error,
        items: action.data
      })
    case C.ERROR_REPORT:
      return Object.assign({}, state, {
        isFetching: action.isFetching,
        error: action.error
      })
    default:
      return state
  }
}