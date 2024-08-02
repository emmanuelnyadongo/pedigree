import { Grid, Select, TextField, Button } from "@shopify/polaris";
import { createOptions } from "../utils";

export function PestForm({
  pest,
  index,
  updateItem,
  deleteItem,
  formOptions,
}: {
  pest: any;
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
            updateItem("pests", index, "pest_id", value);
          }}
          value={pest.pest_id}
          label="Disease Name"
          options={createOptions(formOptions.pest)}
        ></Select>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 3 }}>
        <Select
          onChange={(value) => {
            updateItem("pests", index, "pest_incidence_likelihood_id", value);
          }}
          value={pest.pest_incidence_likelihood_id}
          label="Pest Incidence Likelihood"
          options={createOptions(formOptions.likelihood)}
        ></Select>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 2 }}>
        <TextField
          onChange={(value) => {
            updateItem("pests", index, "treatment", value);
          }}
          value={pest.treatment}
          label="Treatment"
          autoComplete="None"
          multiline
        ></TextField>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 2 }}>
        <TextField
          onChange={(value) => {
            updateItem("pests", index, "precautions", value);
          }}
          value={pest.precautions}
          label="Precautions"
          autoComplete="None"
          multiline
        ></TextField>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 2 }}>
        <Button
          variant="tertiary"
          onClick={() => {
            deleteItem("pests", index);
          }}
        >
          Delete
        </Button>
      </Grid.Cell>
    </Grid>
  );
}
