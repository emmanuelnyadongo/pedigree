import { Grid, Select, TextField, Button } from "@shopify/polaris";
import { createOptions } from "../utils";

export function FertiliserApplicationForm({
  fertiliserApplication,
  index,
  updateItem,
  deleteItem,
  formOptions,
}: {
  fertiliserApplication: any;
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
            updateItem(
              "fertiliser_applications",
              index,
              "fertiliser_id",
              value
            );
          }}
          value={fertiliserApplication.fertiliser_id}
          label="Fertiliser Name"
          options={createOptions(formOptions.fertiliser)}
        ></Select>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 3 }}>
        <TextField
          onChange={(value) => {
            updateItem(
              "fertiliser_applications",
              index,
              "milestone_for_application",
              value
            );
          }}
          value={fertiliserApplication.milestone_for_application}
          label="Milestone for Application"
          autoComplete="none"
        ></TextField>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 3 }}>
        <TextField
          onChange={(value) => {
            updateItem(
              "fertiliser_applications",
              index,
              "quantity_per_plant",
              Number(value)
            );
          }}
          value={fertiliserApplication.quantity_per_plant}
          label="Quantity Per Plant (grams)"
          autoComplete="None"
          type="number"
        ></TextField>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 3 }}>
        <Button
          variant="tertiary"
          onClick={() => {
            deleteItem("fertiliser_applications", index);
          }}
        >
          Delete
        </Button>
      </Grid.Cell>
    </Grid>
  );
}
