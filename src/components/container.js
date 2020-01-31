import { connect } from "react-redux"
import { selectMenu } from "../actions"
import _Control from "./UI/Control"
import _Menu from "./UI/Menu"
import _View from "./UI/View"

export const Control = connect(
    null,
    null
)(_Control)

export const Menu = connect(
    null,
    dispatch => ({
        openView: (e) => dispatch(selectMenu(e.currentTarget.innerHTML))
    })
)(_Menu)

export const View = connect(
    state => ({
        view: state.selectMenu.category
    }),
    null
)(_View)
