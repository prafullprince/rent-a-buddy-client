import { categoryEndPoints } from "../api";
import { apiConnector } from "../apiConnector";

// fetchCategoriesSubCategories
export const fetchCategorySubCategory = async () => {
    try {
        // apiCall
        const response = await apiConnector("GET", categoryEndPoints.FETCH_CATEGORY_SUBCATEGORY);

        console.log(response)
        return response.data;
    } catch (error) {
        console.log(error);
    }
}