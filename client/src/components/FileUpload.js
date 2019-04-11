import React, { Fragment, useState } from "react";
import Message from "./Message";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("Choose file");
  const [uploadFile, setUploadedFile] = useState({});
  const [msg, setMsg] = useState("");

  const onChange = e => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
      setMsg("File uploaded");
    } catch (err) {
      if (err.response.status === 500) {
        setMsg("Internal server error");
      } else {
        setMsg(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      {msg ? <Message msg={msg} /> : null}
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {fileName}
          </label>
          <input
            type="submit"
            value="Upload"
            className="btn btn-primary btn-block mt-4"
          />
        </div>
      </form>
      {uploadFile ? (
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h3 className="text-center">{uploadFile.fileName}</h3>
            <img
              src={uploadFile.filePath}
              alt={uploadFile.fileName}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;
