import { GoMarkGithub, GoCloudUpload } from 'react-icons/go';
import { useRef } from 'react';

import { validateRunRecords, RunRecord } from '../lib/runRecord';

const LogoText = 'SC Visualizer';

type LogoProps = {
  text: string
}
const Logo = (props: LogoProps) => {
  const { text } = props;

  return (
    <div className="font-black text-extralbold text-4xl antialiased">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-500">
        {text}
      </span>
    </div>
  );
};

type UploadFileButtonProps = {
  onRecordsUpdate: (data: RunRecord[]) => void
}
const UploadFileButton = (props: UploadFileButtonProps) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const onRecordDataUploaded = async (file: File) => {
    let records;
    try {
      records = JSON.parse(await file.text());
    } catch (err) {
      console.log('cannot read text of file');
      return;
    }
    const result = validateRunRecords(records);
    if (result === undefined) {
      console.log('validation failed');
    } else {
      props.onRecordsUpdate(result);
    }
  };
  return (
    <>
      <button
        type="button"
        className="px-3 text-2xl hover:text-gray-500 flex"
        onClick={() => hiddenFileInput?.current?.click()}
      >
        <GoCloudUpload />
      </button>
      <input
        className="hidden"
        ref={hiddenFileInput}
        type="file"
        onChange={(e) => {
          if (e?.target?.files) {
            onRecordDataUploaded(e.target.files[0]);
          }
        }}
      />
    </>
  );
};

const GitHubLink = () => (
  <a
    className="hover:text-gray-500 antialiased px-3 text-2xl flex"
    target="_blank"
    rel="noreferrer"
    href="https://github.com/ianchen-tw/sc-vis"
  >
    <GoMarkGithub />
  </a>
);

type HeaderProps = {
  onRecordsUpdate: (data: RunRecord[]) => void;
}
const Header = (props: HeaderProps) => {
  const { onRecordsUpdate } = props;
  return (
    <header className="pt-5">
      <div className="max-w-container flex items-center m-2">
        <div className="flex-none">
          <Logo text={LogoText} />
        </div>
        <div className="flex-grow flex justify-end">
          <UploadFileButton onRecordsUpdate={onRecordsUpdate} />
          <GitHubLink />
        </div>
      </div>
    </header>
  );
};

export default Header;
