import type { ChangeEvent, ReactNode } from "react";
import { v4 as uuidV4 } from "uuid";
import { SCREENREADER_CLASSNAME } from "@/src/shared/constants.ts";
import "./styles.css";

type InputFieldProps = {
  /**
   * the placeholder which is shown if no value is set
   * provide undefined if you do not want to show anything in case of an empty value
   */
  placeholder?: string;

  /** the (accesible) description for this input */
  label: string;

  /** when this toggle is set to true the label will only be shown for screenreaders */
  showLabel?: boolean;

  /** an icon which will be rendered on the right side of the input if given */
  icon?: ReactNode;

  /** the value of the input */
  value?: string;

  /** the callback to be executed when ever the value of this input changes */
  onInputValueChange: (searchValue: string) => void;
};

export const InputField = ({
  placeholder,
  label,
  showLabel,
  icon,
  value,
  onInputValueChange,
}: InputFieldProps) => {
  const inputId = uuidV4();
  const handleInputFieldValueChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    onInputValueChange(event.target.value);
  };

  return (
    <div className="InputField">
      <label
        htmlFor={inputId}
        className={`InputFieldLabel ${showLabel ? "" : `${SCREENREADER_CLASSNAME}`}`}
      >
        {label}
      </label>
      <div className="InputFieldInputIconWrapper">
        <input
          id={inputId}
          className={`InputFieldInput ${
            // biome-ignore lint/security/noSecrets: no secret
            icon ? "InputFieldInputWithIcon" : ""
          }`}
          onChange={handleInputFieldValueChange}
          placeholder={placeholder}
          {...(value ? { value } : {})}
        />
        {icon ? <span className="InputFieldIcon">{icon}</span> : undefined}
      </div>
    </div>
  );
};
