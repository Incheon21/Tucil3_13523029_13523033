const Navbar = () => {
  return (
    <nav>
      <div className="flex items-center w-full justify-between p-4 bg-gray-800 text-white">
        <div className="text-lg font-bold">Rush Hour Solver</div>
        <ul className="flex space-x-4">
          <li><a href="#home" className="hover:text-gray-400">Home</a></li>
          <li><a href="#about" className="hover:text-gray-400">About</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar