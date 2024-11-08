import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils"; // Assuming this is defined elsewhere

const backgroundVariants = cva(
    "rounded-full flex items-center justify-center", // Fixed typo from "fex" to "flex"
    {
        variants: {
            variant: {
                default: "bg-sky-100",
                success: "bg-emerald-100", // Fixed typo from "sucess" to "success"
            },
            size: {
                default: "p-2",
                sm: "p-1",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const IconVariants = cva(
    "",
    {
        variants: {
            variant: {
                default: "text-sky-700",
                success: "text-emerald-700", // Fixed typo from "sucess" to "success"
            },
            size: {
                default: "h-8 w-8",
                sm: "h-4 w-4",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

type backgroundVariantsProps = VariantProps<typeof backgroundVariants>;
type IconVariantsProps = VariantProps<typeof IconVariants>;

interface IconBadgeProps extends backgroundVariantsProps, IconVariantsProps {
    icon: LucideIcon;
}

export const IconBadge = ({
    icon: Icon,
    variant = "default",  // Default variant value for safety
    size = "default",     // Default size value for safety
}: IconBadgeProps) => {
    return (
        <div className={cn(backgroundVariants({ variant, size }))}>
            <Icon className={cn(IconVariants({ variant, size }))} />
        </div>
    );
};
