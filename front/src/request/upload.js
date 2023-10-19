import axios from "axios";

export const upload = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios
        .post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data", // 设置请求头为 multipart/form-data
            },
        })
        .then((res) => {
            console.log(res, "res");
        })
        .catch((error) => {
            console.log(error);
        });
};
