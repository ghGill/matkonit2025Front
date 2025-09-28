import envVar from "../services/env";
import axios from "axios";
import type { recipeType } from "../types/types";

class API_SERVICE {
    private serverUrl:string;
    private axios: any;

    constructor() {
        this.serverUrl = envVar('SERVER_URL') || window.location.href;

        this.axios = axios.create({
            validateStatus: () => true // Always resolve, never reject for HTTP codes
        });
    }

    async createFetch(urlParams:string, method:string, body:any = null, headers:any = null, stringifyBody = true) {
        const apiUrl = `${this.serverUrl}${urlParams}`;

        if (!headers) {
            headers = { // default
                'Content-Type': 'application/json',
            };
        }

        let requestParams:any = {
            url: apiUrl,
            method: method,
        }

        if (Object.keys(headers).length > 0)
            requestParams['headers'] = headers;

        if (body) {
            if (stringifyBody)
                requestParams['data'] = JSON.stringify(body);
            else
                requestParams['data'] = body;
        }

        let result = null;
        try {
            result = await this.axios(requestParams);

            return result.data;
        }
        catch (e) {
            return { success: false };
        }
    }

    async dbAvailable() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/db/available', 'get');

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }

    async getAllCategories() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/category/all', 'get');

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }

    async addCategory(catName:string) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/category/add', 'post', {name: catName});

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }

    async updateCategory(catId:number, catName:string) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/category/update', 'post', {id: catId, name:catName});

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }

    async deleteCategory(catId:number) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/category/delete', 'post', {id: catId});

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }

    async getAllRecipes(catId:number = 0) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/recipe/all', 'post', { carId:catId});

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }

    async addRecipe(recipeData:recipeType) {
        return new Promise(async (resolve, reject) => {
            try {
                const { id, ...withoutIdRecipeData} = recipeData;

                const response = await this.createFetch('/recipe/add', 'post', {data: withoutIdRecipeData});

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }

    async updateRecipe(recipeData:recipeType) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/recipe/update', 'post', {data:recipeData});

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }

    async deleteRecipe(recipeId:number) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/recipe/delete', 'post', {id: recipeId});

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }
}

const api = new API_SERVICE();

export default api;
