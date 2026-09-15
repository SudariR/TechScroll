import React from "react";
import { getIcon } from "../../lib/iconRegistry";

interface Props {
  name?: string;
  className?: string;
}

export const SceneIcon: React.FC<Props> = ({ name, className }) => {
  return React.createElement(getIcon(name), { className });
};
