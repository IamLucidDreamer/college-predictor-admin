import { IS_AUTH, LOGIN } from '../constants/index'

const initialValues = {
	auth: false,
	user: {},
}
const userReducer = (state = initialValues, action) => {
	switch (action.type) {
		case LOGIN: {
			return action.payload
		}
		case IS_AUTH: {
			return {
				...state,
				auth: action.payload,
			}
		}
		default:
			return state
	}
}

export default userReducer
