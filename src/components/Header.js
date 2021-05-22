import { GoMarkGithub } from "react-icons/go"

const LogoText = "SC Visualizer"

const Header = (props) => {
  return (
    <header className="pt-5">
      <div className="max-w-container flex items-center m-2">
        <div className="flex-none">
          <Logo text={LogoText} />
        </div>
        <div className="flex-grow flex justify-end">
          <GitHubLink />
        </div>
      </div>
    </header>
  )
}

const Logo = (props) => {
  return (
    <div className="font-black text-extralbold text-4xl antialiased">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-500">
        {props.text}
      </span>
    </div>
  )
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
