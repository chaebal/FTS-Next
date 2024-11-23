"use client";

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEffect, useState } from "react";

type Checked = DropdownMenuCheckboxItemProps["checked"];
type DropdownProps = {
  onOutputChange: (newOutput: number) => void;
};

export default function Dropdown({ onOutputChange }: DropdownProps) {
  const [position, setPosition] = useState("Shots");
  const [output, setOutput] = useState(0);

  useEffect(() => {
    if (position == "Shots") {
      setOutput(50);
    } else if (position == "Passing") {
      setOutput(20);
    }
  }, [position]);

  console.log(output);

  onOutputChange(output);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{position}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="Shots">Shots</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Passing">Passing</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
