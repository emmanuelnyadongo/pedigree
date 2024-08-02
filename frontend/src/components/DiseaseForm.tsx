import { Grid, Select, TextField, Button } from "@shopify/polaris";
import { createOptions } from "../utils";

export function DiseaseForm({
  disease,
  index,
  updateItem,
  deleteItem,
  formOptions,
}: {
  disease: any;
  index: number;
  updateItem: any;
  deleteItem: any;
  formOptions: any;
}) {
  return (
    <Grid>
      <Grid.Cell columnSpan={{ xs: 3 }}>
        <Select
          onChange={(value) => {
            updateItem("diseases", index, "disease_id", value);
          }}
          value={disease.disease_id}
          label="Disease Name"
          options={createOptions(formOptions.disease)}
        ></Select>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 3 }}>
        <Select
          onChange={(value) => {
            updateItem(
              "diseases",
              index,
              "disease_incidence_likelihood_id",
              value
            );
          }}
          value={disease.disease_incidence_likelihood_id}
          label="Disease Incidence Likelihood"
          options={createOptions(formOptions.likelihood)}
        ></Select>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 2 }}>
        <TextField
          onChange={(value) => {
            updateItem("diseases", index, "treatment", value);
          }}
          value={disease.treatment}
          label="Treatment"
          autoComplete="None"
          multiline
        ></TextField>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 2 }}>
        <TextField
          onChange={(value) => {
            updateItem("diseases", index, "precautions", value);
          }}
          value={disease.precautions}
          label="Precautions"
          autoComplete="None"
          multiline
        ></TextField>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 2 }}>
        <Button
          variant="tertiary"
          onClick={() => {
            deleteItem("diseases", index);
          }}
        >
          Delete
        </Button>
      </Grid.Cell>
    </Grid>
  );
}
