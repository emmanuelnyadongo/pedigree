export function tokenReducer(
  state = null,
  action: { type: string; payload: { token: string } }
) {
  switch (action.type) {
    case "SET_TOKEN":
      return action.payload.token;
    case "REMOVE_TOKEN":
      return null;
    default:
      return state;
  }
}
