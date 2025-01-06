import { ChangeEvent, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import "./styles.scss";

type SearchFieldProps = {
  /**
   * the placeholder which is shown if no value is set
   * provide undefined if you do not want to show anything in case of an empty value
   */
  placeholder?: string;

  /** the (accesible) description for this input */
  label: string;

  /** when this toggle is set to true the label will only be shown for screenreaders */
  showLabel?: boolean;

  /** the callback to be executed when ever the value of this input changes */
  onInputValueChange: (searchValue: string) => void;
};

export const InputField = ({
  placeholder,
  label,
  showLabel,
  onInputValueChange,
}: SearchFieldProps) => {
  const inputId = uuidV4();
  const handleInputFieldValueChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onInputValueChange(event.target.value);
  };

  return (
    <div className="InputField">
      <label
        htmlFor={inputId}
        className={`InputFieldLabel ${showLabel ? "" : "sr-only"}`}
      >
        {label}
      </label>
      <input
        id={inputId}
        className="InputFieldInput"
        onChange={handleInputFieldValueChange}
        placeholder={placeholder}
      />
    </div>
  );
};
