export function breedsReducer(
  state = null,
  action: { type: string; breeds: any }
) {
  switch (action.type) {
    case "SET_BREEDS":
      return action.breeds;
    default:
      return state;
  }
}
