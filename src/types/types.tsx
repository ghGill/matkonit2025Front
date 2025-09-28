export type categoryType = {
    id: number,
    name: string
}

export type recipeType = {
    id: number,
    category_id:number,
    name: string,
    ingredients?: string,
    preparation?: string
    comments?: string,
    image?: string
}
