import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor'
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import ClassicEditor from "./build/ckeditor";
import axios from "axios";
import { useEffect, useState } from "react";

function uploadAdapter(loader) {
  return {
    upload: () => {
      return new Promise(async (resolve, reject) => {
        // try {
        //   const file = await loader.file;
        //   const response = await axios.request({
        //     method: "POST",
        //     url: `${HOST}/upload_files`,
        //     data: {
        //       files: file
        //     },
        //     headers: {
        //       "Content-Type": "multipart/form-data"
        //     }
        //   });
        //   resolve({
        //     default: `${HOST}/${response.data.filename}`
        //   });
        // } catch (error) {
        //   reject("Hello");
        // }
      });
    },
    abort: () => { }
  };
}
function uploadPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return uploadAdapter(loader);
  };
}

export default function Editor({
  onChange,
  data
}) {
  const [editor, setEditor] = useState(
    "<p>Hello world</p>"
  );
  return (
    <CKEditor
      editor={ClassicEditor}
      onReady={(editor) => { }}
      onBlur={(event, editor) => { }}
      onFocus={(event, editor) => { }}
      onChange={(event, editor) => {
        const data = editor.getData()
        setEditor(data);
        onChange?.(data)
      }}
      data={data}
    />
  );
};
