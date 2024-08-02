export function cultivarsReducer(
  state = null,
  action: { type: string; cultivars: any }
) {
  switch (action.type) {
    case "SET_CULTIVARS":
      return action.cultivars;
    default:
      return state;
  }
}
