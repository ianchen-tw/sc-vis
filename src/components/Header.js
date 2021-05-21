const LogoText = "SC Visualizer"

const Header = (props) => {
  return (
    <header className="pt-5">
      <div class="max-w-container flex items-center m-2">
        <div className="flex-none">
          <Logo text={LogoText} />
        </div>
        <div className="flex-grow flex justify-end">
          <LinkedItem
            text="Docs"
            url="https://tailwindcss.com/docs"
          ></LinkedItem>
          <LinkedItem
            text="GitHub"
            url="https://github.com/ianchen-tw/sc-vis"
          ></LinkedItem>
        </div>
      </div>
    </header>
  )
}

const Logo = (props) => {
  return (
    <div className="font-black text-extralbold text-4xl antialiased">
      <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
        {props.text}
      </span>
    </div>
  )
}

const LinkedItem = (props) => {
  return (
    <a
      className="hover:text-gray-500 antialiased"
      target="_blank"
      rel="noreferrer"
      href={props.url ? props.url : "#"}
    >
      <span className="px-3 text-2xl">{props.text}</span>
    </a>
  )
}

export default Header
