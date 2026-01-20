"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Option } from "../types";
import { Spinner } from "./loader";
import { cn } from "../lib/utils";

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
	const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
	const selectRef = useRef<HTMLDivElement | null>(null);
	const dropdownRef = useRef<HTMLUListElement | null>(null);
	const [portalContainer, setPortalContainer] = useState<HTMLElement | ShadowRoot | null>(null);

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

	// Determine portal container (shadow root container or document body)
	useEffect(() => {
		if (selectRef.current) {
			const rootNode = selectRef.current.getRootNode();
			if (rootNode instanceof ShadowRoot) {
				// We're inside a shadow DOM, create or find a dropdown container
				// React 18+ supports ShadowRoot directly, but using a container is more explicit
				let dropdownContainer = rootNode.getElementById('tender-dropdown-container');
				if (!dropdownContainer) {
					dropdownContainer = document.createElement('div');
					dropdownContainer.id = 'tender-dropdown-container';
					rootNode.appendChild(dropdownContainer);
				}
				setPortalContainer(dropdownContainer);
			} else {
				// We're in the regular DOM, use document.body
				setPortalContainer(document.body);
			}
		}
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: Event) => {
			const target = event.target as Node;
			if (
				selectRef.current && 
				!selectRef.current.contains(target) &&
				dropdownRef.current &&
				!dropdownRef.current.contains(target)
			) {
				closeDropdown();
			}
		};

		if (isOpen) {
			// Use the appropriate root node for event listeners
			const rootNode = selectRef.current?.getRootNode() || document;
			rootNode.addEventListener("mousedown", handleClickOutside);
			
			return () => {
				rootNode.removeEventListener("mousedown", handleClickOutside);
			};
		}
	}, [isOpen]);

	const updateDropdownPosition = () => {
		if (selectRef.current) {
			const rect = selectRef.current.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const dropdownHeight = 200; // Approximate height of the dropdown content
			const willOpenUp = rect.bottom + dropdownHeight > viewportHeight;
			setShouldOpenUp(willOpenUp);
			
			// Calculate position for portal
			setDropdownPosition({
				top: willOpenUp ? rect.top - dropdownHeight : rect.bottom + 8,
				left: rect.left,
				width: rect.width,
			});
		}
	};

	useEffect(() => {
		if (isOpen) {
			updateDropdownPosition();
			
			const handleScroll = () => updateDropdownPosition();
			const handleResize = () => updateDropdownPosition();
			
			window.addEventListener('scroll', handleScroll, true);
			window.addEventListener('resize', handleResize);
			
			return () => {
				window.removeEventListener('scroll', handleScroll, true);
				window.removeEventListener('resize', handleResize);
			};
		}
	}, [isOpen]);

	return (
		<div ref={selectRef} className={`ta:relative ta:w-full sm:ta:w-fit ${className}`} tabIndex={0} onKeyDown={handleKeyDown}>
			<button
				className={cn(
					"ta:flex ta:items-center ta:justify-between ta:px-3 ta:py-2 ta:text-sm ta:min-h-[44px] ta:touch-manipulation",
					"ta:border ta:border-solid ta:border-[#E6E6E6]",
					triggerClassName,
					disabled ? "ta:cursor-not-allowed ta:opacity-50" : "ta:cursor-pointer",
					isOpen ? "ta:bg-white" : "ta:bg-white"
				)}
				onClick={toggleDropdown}
				disabled={disabled}
				type="button"
			>
				<span className="ta:flex ta:flex-row ta:items-center ta:gap-2 ta:w-3/4">
					{value?.icon && <img src={value.icon} className="ta:w-5 ta:h-5 ta:object-contain" />}
					<span className={`ta:flex-1 ta:text-left ta:truncate ta:overflow-hidden ta:text-ellipsis ${value?.label ? "ta:text-[#101828]" : "ta:text-[#667085]"}`}>
						{value?.label || placeholder}
					</span>
				</span>
				<span className="ta:flex ta:flex-row ta:items-center ta:gap-2 ta:ml-2 ta:w-1/4">{loading ?  <Spinner size={15} /> : <ChevronDown size={18} className="ta:text-[#667085]" />}</span>
			</button>

			{isOpen && typeof document !== 'undefined' && portalContainer && createPortal(
				<ul
					ref={dropdownRef}
					className={`ta:fixed ta:z-[99999] ta:h-fit ta:max-h-40 ta:overflow-y-auto ta:overflow-x-hidden ta:rounded-lg ta:border ta:border-[#E6E6E6] ta:shadow-xl ta:max-w-[calc(100vw-2rem)] sm:ta:max-w-none ta:bg-white ta:text-black ${dropdownClassName}`}
					role="listbox"
					style={{ 
						top: `${dropdownPosition.top}px`,
						left: `${dropdownPosition.left}px`,
						width: `${dropdownPosition.width}px`,
						zIndex: 99999
					}}
				>
					{options.map((option: Option, index) => (
						<li
							key={option.value}
							className={`ta:relative ta:flex ta:cursor-pointer ta:items-center ta:rounded ta:p-3 ta:px-4 ta:py-3 ta:text-base ta:outline-none ta:min-h-[44px] ta:touch-manipulation hover:ta:bg-gray-100
							${highlightedIndex === index || option.label === value?.label ? "ta:bg-gray-100" : "ta:bg-white"}`}
							onClick={() => handleOptionSelect(option)}
							onMouseEnter={() => setHighlightedIndex(index)}
							role="option"
							aria-selected={value?.value === option.value}
						>
              <span className="ta:flex ta:flex-row ta:items-center ta:gap-2 ta:flex-1">
								{option?.icon && <img src={option.icon} className="ta:w-5 ta:h-5 ta:object-contain" />}
								<span>{option?.label}</span>
							</span>
							{option.label === value?.label && (
								<span className="ta:absolute ta:right-3 ta:flex ta:h-3.5 ta:w-3.5 ta:items-center ta:justify-center">
									<Check className="h-4 w-4" />
								</span>
							)}
						</li>
					))}
				</ul>,
				portalContainer
			)}
		</div>
	);
};
