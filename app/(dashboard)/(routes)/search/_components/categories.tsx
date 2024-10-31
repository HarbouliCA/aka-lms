"use client"

import { Category } from "@prisma/client";
import {
    FcEngineering,
    FcBiomass,
    FcMultipleDevices,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcHome ,
    FcGlobe,
    FcMusic,
} from "react-icons/fc";

import {IconType} from "react-icons";
import { CategoryItem } from "./category-item";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> ={
    "Photography": FcOldTimeCamera,
    "Cooking": FcHome ,
    "Accounting": FcSalesPerformance,
    "Marketing": FcGlobe,
    "Computer Science": FcMultipleDevices,
    "Engineering" : FcEngineering,
    "Pharmaceutical industry" : FcBiomass,
    "Music" : FcMusic ,
};

export const Categories = ({
    items,
} : CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-auto pb-2">
            {items.map((item) => (
                <CategoryItem 
                    key = {item.id}
                    label = {item.name}
                    icon = {iconMap[item.name]}
                    value = {item.id}
                />
            ))}
        </div>
    )
}