import { Grid, Select, TextField, Button } from "@shopify/polaris";
import { createOptions } from "../utils";

export function ExpectedProductYieldForm({
  product_yield,
  index,
  updateItem,
  deleteItem,
  formOptions,
}: any) {
  return (
    <Grid>
      <Grid.Cell columnSpan={{ xs: 3 }}>
        <Select
          value={product_yield.product_id}
          onChange={(value) => {
            updateItem("expected_product_yields", index, "product_id", value);
          }}
          label="Product"
          options={createOptions(formOptions.product)}
        ></Select>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 3 }}>
        <TextField
          onChange={(value) => {
            updateItem(
              "expected_product_yields",
              index,
              "average_quantity_produced",
              Number(value)
            );
          }}
          value={product_yield.average_quantity_produced}
          label="Average Quantity Produced"
          autoComplete="none"
          type="number"
        ></TextField>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 3 }}>
        <Select
          name="product_unit_id"
          value={product_yield.product_unit_id}
          onChange={(value) => {
            updateItem(
              "expected_product_yields",
              index,
              "product_unit_id",
              value
            );
          }}
          label="Units of measure"
          options={createOptions(formOptions.conventionalUnit)}
        ></Select>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 3 }}>
        <Button
          variant="tertiary"
          onClick={() => deleteItem("expected_product_yields", index)}
        >
          Delete
        </Button>
      </Grid.Cell>
    </Grid>
  );
}
