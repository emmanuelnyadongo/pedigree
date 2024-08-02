export function createInitialState(type: "breed" | "cultivar") {
  // @ts-ignore

  if (type === "breed") {
    return {
      name: "",
      animal_id: "1aa3ddfc-da12-4b5a-bd79-b868be3a9f82",
      daily_feed: 0,
      daily_water: 0,
      min_temp: 0,
      max_temp: 0,
      annual_fertility_rate: 0,
      expected_product_yields: [],
      diseases: [],
      pests: [],
    };
  } else {
    return {
      name: "",
      crop_id: "8634f034-4fb3-4c23-8199-87caad32659c",
      min_temp: 0,
      max_temp: 0,
      min_daily_irrigation: 0,
      max_daily_irrigation: 0,
      min_annual_cold_hours: 0,
      max_annual_cold_hours: 0,
      min_soil_pH: 0,
      max_soil_pH: 0,
      soil_type_id: "33c8499d-88e4-4103-9f4c-37b06f5683ba",
      diseases: [],
      pests: [],
      expected_product_yields: [],
      fertiliser_applications: [],
    };
  }
}
