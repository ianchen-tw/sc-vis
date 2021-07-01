import { GoMarkGithub, GoCloudUpload } from "react-icons/go"
import { React, useRef } from "react"
import PropTypes from "prop-types"

import { validateRunRecords } from "../lib/runRecord"

const LogoText = "SC Visualizer"

const Header = ({ onRecordsUpdate }) => {
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
  )
}
Header.propTypes = {
  onRecordsUpdate: PropTypes.func,
}

const Logo = ({ text }) => {
  return (
    <div className="font-black text-extralbold text-4xl antialiased">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-500">
        {text}
      </span>
    </div>
  )
}
Logo.propTypes = {
  text: PropTypes.string,
}

const UploadFileButton = ({ onRecordsUpdate }) => {
  const hiddenFileInput = useRef(null)

  let onRecordDataUploaded = async (file) => {
    let records
    try {
      records = JSON.parse(await file.text())
    } catch (err) {
      console.log("cannot read text of file")
      return
    }
    if (!validateRunRecords(records)) {
      console.log("validation failed")
      return
    }
    onRecordsUpdate(records)
  }
  return (
    <>
      <button
        className="px-3 text-2xl hover:text-gray-500 flex"
        onClick={() => hiddenFileInput.current.click()}
      >
        <GoCloudUpload />
      </button>
      <input
        className="hidden"
        ref={hiddenFileInput}
        type="file"
        onChange={(e) => {
          onRecordDataUploaded(e.target.files[0])
        }}
      />
    </>
  )
}
UploadFileButton.propTypes = {
  onRecordsUpdate: PropTypes.func,
}

const GitHubLink = () => (
  <a
    className="hover:text-gray-500 antialiased px-3 text-2xl flex"
    target="_blank"
    rel="noreferrer"
    href="https://github.com/ianchen-tw/sc-vis"
  >
    <GoMarkGithub />
  </a>
)

export default Header
