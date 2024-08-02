import { OptionList, Text } from "@shopify/polaris";
import { authenticatedFetch } from "../apiHelpers";
import { useDispatch, useStore } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function BreedsList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const store = useStore();
  const navigate = useNavigate();

  // @ts-ignore
  const breeds: any[] = store.getState().breeds;

  const getBreeds = () => {
    authenticatedFetch("/api/breeds")
      .then(async (response) => {
        const breeds = await response.json();
        dispatch({ type: "SET_BREEDS", breeds });
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(getBreeds, []);

  if (loading) return <Text as="p">Loading...</Text>;
  else if (error) return <Text as="p">Something went wrong.</Text>;
  else
    return (
      <>
        <Text as="p" variant="headingSm">
          Breeds
        </Text>
        <OptionList
          selected={[]}
          onChange={(id) => {
            navigate(`/suppliers/edit-breed/${id}`);
          }}
          //@ts-ignore
          options={store.getState().breeds.map((breed: any) => ({
            label: `${breed.name} (${breed.animal.name})`,
            value: breed.id,
          }))}
        ></OptionList>
      </>
    );
}
