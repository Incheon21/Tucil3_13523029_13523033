import React from "react";

const About: React.FC = () => {
  return (
    <div className="w-full mx-auto p-5 flex flex-grow flex-col bg-gray-900 text-white">
      <div className="text-center mb-8">
        <h1 className="font-bold text-3xl text-pink-500">About Rush Hour Solver</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-pink-800 pb-2 text-pink-400">Apa itu Rush Hour?</h2>
          <p className="mb-4 text-gray-300 leading-relaxed">
            Rush Hour adalah sebuah permainan puzzle logika berbasis grid yang menantang pemain untuk menggeser kendaraan di dalam sebuah kotak (biasanya berukuran 6x6) agar mobil utama (biasanya berwarna merah) dapat keluar dari kemacetan melalui pintu keluar di sisi papan. Setiap kendaraan hanya bisa bergerak lurus ke depan atau ke belakang sesuai dengan orientasinya (horizontal atau vertikal), dan tidak dapat berputar. Tujuan utama dari permainan ini adalah memindahkan mobil merah ke pintu keluar dengan jumlah langkah seminimal mungkin.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-pink-800 pb-2 text-pink-400">Tentang Rush Hour Solver</h2>
          <p className="mb-4 text-gray-300 leading-relaxed">
            Rush Hour Solver ini menggunakan algoritma pencarian untuk menemukan solusi optimal dari konfigurasi puzzle Rush Hour yang valid. Solver ini mendukung beberapa algoritma pencarian:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-300">
            <li className="mb-2">
              <span className="font-semibold text-pink-400">UCS (Uniform Cost Search)</span> 
            </li>
            <li className="mb-2">
              <span className="font-semibold text-pink-400">GBFS (Greedy Best-First Search)</span> 
            </li>
            <li className="mb-2">
              <span className="font-semibold text-pink-400">A* Search</span> 
            </li>
            <li className="mb-2">
              <span className="font-semibold text-pink-400">Fringe Search</span> 
            </li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-6 border-b-2 border-pink-800 pb-2 text-pink-400">Creators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Creator 1 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center border border-pink-800">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
                <img 
                  src="/bryho.jpg" 
                  alt="Creator 1" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1 text-pink-400">Bryan Ho</h3>
              <p className="text-gray-400 mb-3">13523029</p>
              <a 
                href="https://github.com/bry-ho" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-400 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
            
            {/* Creator 2 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center border border-pink-800">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
                <img 
                  src="/alvin.jpg" 
                  alt="Creator 2" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1 text-pink-400">Alvin Chrisotpher Santausa</h3>
              <p className="text-gray-400 mb-3">13523033</p>
              <a 
                href="https://github.com/Incheon21" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-400 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;