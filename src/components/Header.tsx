import { GoMarkGithub, GoCloudUpload } from 'react-icons/go';
import { useRef } from 'react';

import { RunRecord } from '../lib/types';
import { validateSCLogs, LogConfig } from '../lib/validate';

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
  onRecordsUpdate: (data: RunRecord[]) => void,
  onConfigUpdate: (data: LogConfig) => void
}
const UploadFileButton = (props: UploadFileButtonProps) => {
  const { onConfigUpdate, onRecordsUpdate } = props;
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const onRecordDataUploaded = async (file: File) => {
    const result = validateSCLogs(await file.text());
    if (result.ok) {
      const { runRecords, config } = result.val;
      onRecordsUpdate(runRecords);
      onConfigUpdate(config);
    } else {
      const err = result.val;
      console.log(err);
      console.log(err.message);
      if (err.hintObject !== undefined) {
        console.log('hint object', err.hintObject);
      }
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
  onConfigUpdate: (data: LogConfig) => void;
}
const Header = (props: HeaderProps) => {
  const { onRecordsUpdate, onConfigUpdate } = props;
  return (
    <header className="pt-5">
      <div className="max-w-container flex items-center m-2">
        <div className="flex-none">
          <Logo text={LogoText} />
        </div>
        <div className="flex-grow flex justify-end">
          <UploadFileButton
            onRecordsUpdate={onRecordsUpdate}
            onConfigUpdate={onConfigUpdate}
          />
          <GitHubLink />
        </div>
      </div>
    </header>
  );
};

export default Header;
