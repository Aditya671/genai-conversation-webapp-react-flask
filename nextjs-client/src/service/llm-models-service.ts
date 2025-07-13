import { Endpoints } from "../helper/endPoints";
import { LlmModels, setLlmModelsList } from "@/store/base/slice";
import { customAxios } from "./axios-service";
import { AppDispatch } from "@/store/store";


export const getLlmModelsList = (
) => async (dispatch: AppDispatch) => {
    try {
        const response = await customAxios<LlmModels[]>({
            url: Endpoints.getLlmModels,
            method: "get",
        });
        dispatch(setLlmModelsList(response.data));
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};