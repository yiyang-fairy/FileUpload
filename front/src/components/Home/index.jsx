import "./index.css";
import { Space, Table, Progress, Button } from "antd";
import { upload } from "../../request/index";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
export default function Home() {
    const [data, setData] = useImmer([]);
    const [, forceUpdate] = useState(1);
    const clickUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach((item) => (item.progress = 0));
        setData((draft) => draft.concat(...files));
    };
    const dragenter = (e) => {
        e.preventDefault();
    };
    const dragOver = (e) => {
        e.preventDefault();
    };
    const drop = (e) => {
        e.preventDefault();
        for (const item of e.dataTransfer.items) {
            const entry = item.webkitGetAsEntry(); //通过这个方法得到文件对象
            isDirectory(entry);
        }
    };
    const isDirectory = (entry) => {
        if (entry.isDirectory) {
            //判断拖拽文件是否是文件夹
            const reader = entry.createReader(); //创建目录读取器
            reader.readEntries((entries) => {
                //读取目录下的所有
                for (const entry of entries) {
                    isDirectory(entry);
                }
            });
        } else {
            entry.file((f) => {
                // 拿到file对象
                f.progress = 0;
                setData((draft) => {
                    draft.push(f);
                });
            });
        }
    };

    const columns = [
        {
            title: "文件名",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "类型",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "大小",
            dataIndex: "size",
            key: "size",
        },
        {
            title: "进度",
            dataIndex: "progress",
            key: "progress",
            render: (progress) => {
                console.log(progress);
                return <Progress percent={progress} />;
            },
        },
        {
            title: "操作",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => deleteFile(record)}>删除</a>
                    <a onClick={() => uploadFile(record)}>上传</a>
                    <a onClick={() => cancelUpload(record)}>取消</a>
                </Space>
            ),
        },
    ];

    const uploadFile = (file) => {
        const handleProgress = (progress) => {
            setData((draft) => {
                const fileIndex = draft.findIndex((item) => item === file);
                console.log(progress, "progress");
                if (fileIndex !== -1) {
                    // debugger;
                    draft[fileIndex].progress = progress;
                    forceUpdate((v) => v + 1);
                }
                return draft;
            });
        };
        upload(file, handleProgress)
            .then((res) => {
                console.log(res, "res");
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const uploadAll = () => {
        for (const file of data) {
            uploadFile(file);
        }
    };
    const deleteFile = (file) => {
        setData((draft) => draft.filter((item) => item != file));
    };
    const cancelUpload = (file) => {
        console.log("cancle");
    };

    console.log(data);
    return (
        <div className="over">
            <div
                className="first"
                onDragEnter={dragenter}
                onDragOver={dragOver}
                onDrop={drop}
            >
                <input
                    onChange={clickUpload}
                    type="file"
                    multiple
                    webkitdirectory="true"
                />
            </div>
            <div>
                <Button type="primary" onClick={uploadAll}>
                    全部上传
                </Button>
                <Table columns={columns} dataSource={data} />
                {JSON.stringify(data)}
            </div>
        </div>
    );
}
