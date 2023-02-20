import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import styles from "../../styles/Global.module.scss";
const Editor = (props:any) => {
  return (
    <CKEditor sx={{maxHeight:'400px'}}
      editor={ClassicEditor}
      data={props.value}
      config={{
        
        removePlugins: [
          //"Essentials",
          "CKFinderUploadAdapter",
          //"Autoformat",
          //"Bold",
          //"Italic",
          "BlockQuote",
          "CKBox",
          "CKFinder",
          "CloudServices",
          "EasyImage",
          //"Heading",
          "Image",
          "ImageCaption",
          "ImageStyle",
          "ImageToolbar",
          "ImageUpload",
          "Indent",
          "Link",
          //"List",
          "MediaEmbed",
          //"Paragraph",
          "PasteFromOffice",
          "PictureEditing",
          //"Table",
          //"TableToolbar",
          //"TextTransformation"
      ],
      language: 'es'
      }}
      onChange={(event:any, editor:any) => {
        const data = editor.getData();
        props.onChange(data);
      }}
    />
  );
};
/** */
export default Editor;