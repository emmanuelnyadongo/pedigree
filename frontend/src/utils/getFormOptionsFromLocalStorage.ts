interface Option {
  id: string;
  name: string;
}

export function getFormOptionsFromLocalStorage(optionsType: string) {
  const optionsJSON = window.localStorage.getItem("formOptions");

  if (optionsJSON) {
    const parsedOptions = JSON.parse(optionsJSON);
    return parsedOptions[optionsType].map((option: Option) => ({
      label: option.name,
      value: option.id,
    }));
  } else {
    throw new Error("No options found in local storage");
    return [];
  }
}
