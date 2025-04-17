"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Option } from "../types";
import { Spinner } from "./loader";

interface SelectProps {
	options: Option[];
	value: Option | null;
	onChange: (value: Option) => void;
	placeholder?: string;
	disabled?: boolean;
  loading?: boolean;
	className?: string;
	triggerClassName?: string;
	dropdownClassName?: string;
}

export const SelectDropdown = ({
	options,
	value,
	onChange,
	placeholder = "Select an option",
	disabled = false,
  loading = false,
	className = "",
	triggerClassName = "",
	dropdownClassName = "",
}: SelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
	const [shouldOpenUp, setShouldOpenUp] = useState(false);
	const selectRef = useRef<HTMLDivElement | null>(null);

	const toggleDropdown = () => {
		if (!disabled) {
			setIsOpen((prev) => !prev);
		}
	};

	const closeDropdown = () => {
		setIsOpen(false);
		setHighlightedIndex(null);
	};

	const handleOptionSelect = (selectedValue: Option) => {
		onChange(selectedValue);
		closeDropdown();
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (!isOpen) return;

		if (event.key === "ArrowDown") {
			event.preventDefault();
			setHighlightedIndex((prev) => (prev === null || prev === options.length - 1 ? 0 : prev + 1));
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setHighlightedIndex((prev) => (prev === null || prev === 0 ? options.length - 1 : prev - 1));
		} else if (event.key === "Enter" && highlightedIndex !== null) {
			event.preventDefault();
			const selectedOption = options[highlightedIndex];
			if (selectedOption) {
				handleOptionSelect(selectedOption);
			}
		} else if (event.key === "Escape") {
			closeDropdown();
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
				closeDropdown();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (isOpen && selectRef.current) {
			const rect = selectRef.current.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const dropdownHeight = 200; // Approximate height of the dropdown content
			setShouldOpenUp(rect.bottom + dropdownHeight > viewportHeight);
		}
	}, [isOpen]);

	return (
		<div ref={selectRef} className={`ta-relative ta-w-full sm:ta-w-fit ${className}`} tabIndex={0} onKeyDown={handleKeyDown}>
			<button
				className={`ta-flex ta-items-center ta-justify-between ta-rounded-lg !ta-border ta-border-black/10 ta-px-3 ta-py-2 ta-text-sm ta-text-black ${triggerClassName} ${disabled ? "ta-cursor-not-allowed ta-opacity-50" : "ta-cursor-pointer"} ${isOpen ? "!ta-bg-white" : "!ta-bg-white/10"}`}
				onClick={toggleDropdown}
				disabled={disabled}
				type="button"
			>
				<span className="ta-flex ta-flex-row ta-gap-2">{value?.icon && <img src={value.icon} className="ta-w-[20px] ta-h-[20px]" />}{value?.label || placeholder} </span>
				<span className="ta-flex ta-flex-row ta-gap-2">{loading ?  <Spinner size={15} /> : <ChevronDown size={15} />}</span>
			</button>

			{isOpen && (
				<ul
					className={`ta-transparent_style ta-absolute ta-z-10 ta-mt-2 ta-h-fit ta-max-h-40 ta-w-full ta-overflow-y-auto ta-overflow-x-hidden ta-rounded-lg ta-border ta-border-black/10 ta-shadow-lg
					ta-backdrop-blur-lg ${shouldOpenUp ? "ta-bottom-full mb-2" : "ta-top-full ta-mt-2"} ${dropdownClassName}`}
					role="listbox"
				>
					{options.map((option: Option, index) => (
						<li
							key={option.value}
							className={`ta-relative ta-flex ta-cursor-pointer ta-items-center ta-rounded ta-p-2 ta-px-4 ta-py-2 ta-text-base ta-outline-none hover:ta-bg-white/20
							${highlightedIndex === index || option.label === value?.label ? "ta-bg-white/20" : ""}`}
							onClick={() => handleOptionSelect(option)}
							onMouseEnter={() => setHighlightedIndex(index)}
							role="option"
							aria-selected={value?.value === option.value}
						>
              <span className="ta-flex ta-flex-row ta-gap-2">{option?.icon && <img src={option.icon} className="ta-w-[20px] ta-h-[20px]" />}{option?.label} </span>
							{option.label === value?.label && (
								<span className="ta-absolute ta-right-3 ta-flex ta-h-3.5 ta-w-3.5 ta-items-center ta-justify-center">
									<Check className="h-4 w-4" />
								</span>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
