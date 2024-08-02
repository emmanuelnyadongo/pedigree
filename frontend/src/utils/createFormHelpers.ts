function createAddItem(data: any, setData: any, itemTemplates: any) {
  return (
    type:
      | "pests"
      | "diseases"
      | "expected_product_yields"
      | "fertiliser_applications"
  ) => {
    // Copy existing product yields into new array
    const items = [...data[type]];

    // Add a new empty product yield
    items.push({ ...itemTemplates[type] });

    // Update the state
    setData({ ...data, [type]: items });
  };
}

function createUpdateItem(data: any, setData: any) {
  return (
    type:
      | "pests"
      | "diseases"
      | "expected_product_yields"
      | "fertiliser_applications",
    index: number,
    name: string,
    value: string | number
  ) => {
    // Copy existing breed properties
    const items = [...data[type]];

    // Modify the one we want to change
    items[index][name] = value;

    // Set breed to the new, modified one
    setData({ ...data, [type]: items });
  };
}

function createDeleteItem(data: any, setData: any) {
  return (
    type:
      | "pests"
      | "diseases"
      | "expected_product_yields"
      | "fertiliser_applications",
    index: number
  ) => {
    // Copy items to new array
    const newItems = data[type].filter((_item: any, i: number) => index != i);

    // Modify the state
    setData({ ...data, [type]: newItems });
  };
}

function createUpdateProperty(data: any, setData: any) {
  return (name: string, value: string | number) => {
    // Copy existing breed properties
    const newData = { ...data };

    // Modify the one we want to change
    newData[name] = value;

    // Set breed to the new, modified one
    setData(newData);
  };
}

export function createFormHelpers(data: any, setData: any) {
  const itemTemplates = {
    pests: {
      pest_id: "52a4d0a9-9ef0-4121-9161-f82dafb1d1bd",
      pest_incidence_likelihood_id: "e139caf8-e8dc-4395-a40f-f19d9df65a5d",
      treatment: "",
      precautions: "",
    },
    expected_product_yields: {
      product_id: "f057d88b-11ad-44be-b300-5c41d46cb1df",
      product_unit_id: "3af4cd73-d7bb-41df-b229-838e4c7ee8b9",
      average_quantity_produced: 0,
    },
    diseases: {
      disease_id: "1d7f6b47-500a-455c-80c6-203ae7eb778a",
      disease_incidence_likelihood_id: "e139caf8-e8dc-4395-a40f-f19d9df65a5d",
      treatment: "",
      precautions: "",
    },
    fertiliser_applications: {
      fertiliser_id: "b459d4d8-2ff7-4c91-a04e-583f42044a85",
      milestone_for_application: "",
      quantity_per_plant: 0,
    },
  };

  return {
    addItem: createAddItem(data, setData, itemTemplates),
    updateItem: createUpdateItem(data, setData),
    deleteItem: createDeleteItem(data, setData),
    updateProperty: createUpdateProperty(data, setData),
  };
}
