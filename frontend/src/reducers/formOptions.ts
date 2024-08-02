export function formOptionsReducer(
  state = null,
  action: { type: string; formOptions: any }
) {
  switch (action.type) {
    case "SET_FORM_OPTIONS":
      return action.formOptions;
    case "REMOVE_FORM_OPTIONS":
      return null;
    default:
      return state;
  }
}
