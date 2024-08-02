import { OptionList, Text } from "@shopify/polaris";
import { authenticatedFetch } from "../apiHelpers";
import { useDispatch, useStore } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function CultivarsList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const store = useStore();
  const navigate = useNavigate();

  // @ts-ignore
  const cultivars: any[] = store.getState().cultivars;

  const getCultivars = () => {
    authenticatedFetch("/api/cultivars")
      .then(async (response) => {
        const cultivars = await response.json();
        dispatch({ type: "SET_CULTIVARS", cultivars });
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(getCultivars, []);

  if (loading) return <Text as="p">Loading...</Text>;
  else if (error) return <Text as="p">Something went wrong.</Text>;
  else
    return (
      <>
        <Text as="p" variant="headingSm">
          Cultivars
        </Text>
        <OptionList
          selected={[]}
          onChange={(id) => {
            navigate(`/suppliers/edit-cultivar/${id}`);
          }}
          //@ts-ignore
          options={store.getState().cultivars.map((cultivar: any) => ({
            label: `${cultivar.name} (${cultivar.crop.name})`,
            value: cultivar.id,
          }))}
        ></OptionList>
      </>
    );
}
