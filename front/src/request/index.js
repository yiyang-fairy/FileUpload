import axios from "axios";

const api = axios.create({
    baseURL: "api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const cancelUpload = (request) => {
    console.log("取消上传");
    request.cancel();
};

export const upload = (file, onProgress, onCancel) => {
    const formData = new FormData();
    formData.append("file", file);

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
            const progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
            );
            onProgress(progress);
        },
        cancelToken: source.token,
    };

    const request = api.post("/upload", formData, config);

    request.cancel = () => {
        source.cancel("Request canceled by the user.");
    };

    // onCancel(request);

    return request
        .then((res) => {
            // console.log(res, cancelToken, "res");
        })
        .catch((error) => {
            if (axios.isCancel(error)) {
                console.log("Upload canceled", error.message);
            } else {
                console.log("Upload error", error);
            }
        });
};
