export enum EnumCommonImagesCategory {
    EVENT,
    INFRASTRUCTURE,
    GALLERY
}

export const EnumCommonImagesCategoryText: Record<EnumCommonImagesCategory, string> = {
    [EnumCommonImagesCategory.EVENT]: "Event",
    [EnumCommonImagesCategory.INFRASTRUCTURE]: "Infrastructure",
    [EnumCommonImagesCategory.GALLERY]: "Gallery",
}


export function isValidEnumCategoryValue(value: string): value is keyof typeof EnumCommonImagesCategory {
    return Object.values(EnumCommonImagesCategory).includes(value.toUpperCase() as unknown as EnumCommonImagesCategory);
}