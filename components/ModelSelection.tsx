"use client";

import useSWR from "swr";
import Select from "react-select";

const fetchModels = () => fetch("/api/getEngines").then((res) => res.json());

function ModelSelection() {
  const { data: models, isLoading } = useSWR("models", fetchModels);
  const { data: model, mutate: setModel } = useSWR("model", {
    fallbackData: "gpt-4",
  });

  return (
    <div className="mt-2">
      <Select
        className="mt-2"
        options={models?.modelOptions}
        defaultValue={model}
        placeholder={model}
        isSearchable
        isLoading={isLoading}
        menuPosition="fixed"
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "#434654",
            borderColor: "#434654",
            ":hover": {
              borderColor: "#434654",
            },
          }),
          singleValue: (base) => ({
            ...base,
            color: "white",
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "#434654",
          }),
          option: (base) => ({
            ...base,
            color: "white",
          }),
        }}
        onChange={(e) => setModel(e.value)}
      />
    </div>
  );
}

export default ModelSelection;