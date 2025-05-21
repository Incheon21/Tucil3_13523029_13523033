const Navbar = () => {
  return (
    <nav>
      <div className="flex items-center w-full justify-between p-4 bg-black text-white">
        <div className="text-lg font-bold text-pink-500">Rush Hour Solver</div>
        <ul className="flex space-x-4">
          <li><a href="/" className="hover:text-pink-400">Home</a></li>
          <li><a href="/about" className="hover:text-pink-400">About</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar