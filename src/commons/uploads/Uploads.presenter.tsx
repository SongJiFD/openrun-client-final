import { UploadButton, UploadFileHidden, UploadImage } from "./Uploads.styles";

export default function UploadUI(props: any) {
  return (
    <div>
      {props.fileUrl ? (
        <UploadImage
          onClick={props.onClickUpload}
          src={`https://s3.brian-hong.tech/openrun/${props.fileUrl}`}
        />
      ) : (
        <UploadButton type="button" onClick={props.onClickUpload}>
          <>Upload</>
        </UploadButton>
      )}
      <UploadFileHidden
        type="file"
        ref={props.fileRef}
        onChange={props.onChangeFile}
      />
    </div>
  );
}
